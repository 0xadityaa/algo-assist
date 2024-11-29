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

   const logout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 204) {
        // Logout successful, you can perform any client-side cleanup here
        localStorage.removeItem('token');
      } else {
        console.error('Logout failed:', response.status);
        // Handle logout error, maybe display a message to the user
      }
    } catch (error) {
      console.error('Error logging out:', error);
      // Handle network or other errors
    }
  };
  return { logout };
};
