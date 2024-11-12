"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { refreshToken, logout, getUser } from "@/lib/authService";

const publicRoutes = ["/", "/auth"]; // Add your public routes here

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Skip auth check for public routes
        if (publicRoutes.includes(pathname)) {
          setIsLoading(false);
          return;
        }

        // Try to get user data
        const userData = await getUser();

        if (!userData) {
          // If no user data, try to refresh token
          try {
            await refreshToken();
            // Verify the refresh worked by getting user data again
            const refreshedUserData = await getUser();

            if (!refreshedUserData) {
              throw new Error("Failed to refresh authentication");
            }
          } catch (error) {
            console.error("Auth refresh failed:", error);
            // Clear auth state and redirect
            logout();
            router.push("/auth");
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        logout();
        router.push("/auth");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  // For public routes, just render children
  if (publicRoutes.includes(pathname)) {
    return <>{children}</>;
  }

  // For protected routes, render children (auth check is done above)
  return <>{children}</>;
}
