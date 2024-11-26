import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useAuth = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token"); // Replace with your token retrieval logic
    const isAuthenticated = token !== null; // Check if the token exists

    if (!isAuthenticated) {
      router.push('/auth'); // Redirect to the auth page if not authenticated
    }
  }, [router]);
};
