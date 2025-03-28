export interface Message {
    id: string;
    content: string;
    created_at: string | null;
    job_id: string;
    read: boolean | null;
    receiver_id: string;
    sender_id: string;
    sender: {
      full_name: string;
      avatar_url: string;
    };
  }
  