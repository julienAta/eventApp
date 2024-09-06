"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isAuthenticated, refreshToken, logout } from "@/lib/authService";

const publicRoutes = ["/auth", "/about", "/contact"]; // Add your public routes here

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated() && !publicRoutes.includes(pathname)) {
        try {
          await refreshToken();
        } catch (error) {
          logout();
          router.push("/auth");
        }
      }
    };

    checkAuth();
  }, [pathname, router]);

  return <>{children}</>;
}
