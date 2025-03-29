import { Button } from "@/components/ui/button";
import AuthContext from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useContext } from "react";

export default function LogoutButton() {
  const { loading } = useContext(AuthContext);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const supabase = createClientComponentClient();
      await supabase.auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (loading) return null;

  return (
    <Button variant="outline" onClick={handleLogout}>
      Logout
    </Button>
  );
}
