'use client'

import { useState, useEffect, useRef } from 'react'
import { Send } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { supabase } from '@/lib/supabase/client'
import { sendNotification } from '@/lib/notifications/send-notification'
import { formatDistance } from 'date-fns'
import type { Message } from '@/lib/types/message'

interface ChatWindowProps {
  jobId: string
  otherUserId: string
  otherUserName: string
}

export function ChatWindow({ jobId, otherUserId, otherUserName }: ChatWindowProps) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!user) return

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id, content, created_at, sender_id,
          sender:profiles!messages_sender_id_fkey(full_name, avatar_url)
        `)
        .eq('job_id', jobId)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: true })

      if (!error && data) {
        setMessages(data as Message[])
        scrollToBottom()
      }
      setLoading(false)
    }

    fetchMessages()

    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `job_id=eq.${jobId}` },
        (payload) => {
          const newMessage = payload.new as Message
          if (newMessage.sender_id !== user.id) {
            setMessages(prev => [...prev, newMessage])
            scrollToBottom()
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [jobId, user])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !newMessage.trim()) return

    try {
      const { data: messageData, error } = await supabase
        .from('messages')
        .insert({
          job_id: jobId,
          sender_id: user.id,
          receiver_id: otherUserId,
          content: newMessage,
        })
        .select(`
          id, content, created_at, sender_id,
          sender:profiles!messages_sender_id_fkey(full_name, avatar_url)
        `)
        .single()

      if (error) throw error

      setMessages(prev => [...prev, messageData as Message])
      setNewMessage('')
      scrollToBottom()

      await sendNotification(
        otherUserId,
        'message',
        'New Message',
        `${messageData.sender.full_name} sent you a message`,
        { jobId }
      )
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col h-[600px] bg-background border rounded-lg">
      <div className="p-4 border-b">
        <h3 className="font-semibold">Chat with {otherUserName}</h3>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-2 ${
                message.sender_id === user?.id ? 'flex-row-reverse' : ''
              }`}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={message.sender.avatar_url} />
                <AvatarFallback>{message.sender.full_name[0]}</AvatarFallback>
              </Avatar>
              <div
                className={`max-w-[70%] ${
                  message.sender_id === user?.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                } rounded-lg p-3`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
  {message.created_at
    ? formatDistance(new Date(message.created_at), new Date(), { addSuffix: true })
    : 'Unknown time'}
</p>

              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}
