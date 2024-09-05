"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isAuthenticated } from "@/lib/authService";

const publicRoutes = ["/auth", "/about", "/contact"]; // Add your public routes here

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated() && !publicRoutes.includes(pathname)) {
      router.push("/auth");
    }
  }, [pathname, router]);

  return <>{children}</>;
}
