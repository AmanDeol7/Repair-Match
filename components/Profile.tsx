import Link from "next/link"
import { Button } from "./ui/button"
import { useQuery } from "@tanstack/react-query"
import { useProfile } from "@/hooks/use-profile"
import { supabase } from "@/lib/supabase/client"
import { Database } from "@/lib/supabase/types"
import Image from "next/image"
const initUser = {
    avatar_url: "",
    bio: "",

    email: "",
    id: "",
    image_url: "",
    full_name: "", // Added full_name property
  }

const Profile = () => {
    const user = useQuery( {
        queryKey: ["user"],
        queryFn: async () => {
          
          const {data} = await supabase.auth.getSession();
          if( data.session?.user){
           const{data:user}  = await supabase.from("profiles").select("*").eq("id", data.session.user.id).single();
           return user;
    
          } 
          else return initUser;
        }

        

    })
      
    if( user.isLoading) return <div>Loading...</div>
    if( user.data){
        console.log(user.data)
        return (<Button variant="default" asChild>
           
        <Link href="/"> <div className="flex items-center justify-center gap-3"> <span><Image width={25} height={25}  className=" rounded-full "src={user.data.avatar_url || "/default-avatar.png"} alt={"pfp"}></Image></span>{user.data.full_name} </div></Link>
   </Button>)
    }
    else{

    

  return (
    <div>
        <Button variant="default" asChild>
              <Link href="/signin">Sign In</Link>
        </Button>
    </div>
  )
}
}

export default Profile