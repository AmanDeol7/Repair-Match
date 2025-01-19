import Link from "next/link";
import { Button } from "./ui/button";
import { useQuery } from "@tanstack/react-query";
import { useProfile } from "@/hooks/use-profile";
import { supabase } from "@/lib/supabase/client";
import { Database } from "@/lib/supabase/types";
import Image from "next/image";
import { useAuth } from "@/hooks/use-auth"; // Import useAuth hook
import {useQueryClient} from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const initUser = {
  avatar_url: "",
  bio: "",
  email: "",
  id: "",
  image_url: "",
  full_name: "",
};

const Profile = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth(); // Check authentication status
  const { data: userInfo} = useProfile(user?.id); 
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const handleLogout = async () => {
    queryClient.clear();
    await supabase.auth.signOut();
    setIsLoggedOut(true);
    router.push("/");
  };

  // const user = useQuery({
  //   queryKey: ["user"],
  //   queryFn: async () => {
  //     const { data } = await supabase.auth.getSession();
  //     if (data.session?.user) {
  //       const { data: user } = await supabase
  //         .from("profiles")
  //         .select("*")
  //         .eq("id", data.session.user.id)
  //         .single();
  //       return user;
  //     } else return initUser;
  //   },
  // });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {isAuthenticated && !isLoggedOut? (
        <DropdownMenu>
          <Button variant="default" asChild>
            <DropdownMenuTrigger>
              <Link href="/">
                <div className="flex items-center justify-center gap-3">
                  <span>
                    <Image
                      width={25}
                      height={25}
                      className="rounded-full"
                      src={userInfo?.avatar_url || "/default-avatar.png"}
                      alt={"pfp"}
                    />
                  </span>
                  {userInfo?.full_name}
                  <ChevronDown size={25} />
                </div>
              </Link>
            </DropdownMenuTrigger>
          </Button>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem  onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div>
          <Button variant="default" asChild>
            <Link href="/signin">Sign In</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Profile;
