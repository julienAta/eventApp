"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isAuthenticated } from "@/lib/authService";

const publicRoutes = ["/auth"];

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithAuth(props: P) {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
      if (!isAuthenticated() && !publicRoutes.includes(pathname)) {
        router.push("/auth");
      }
    }, [pathname, router]);

    return <WrappedComponent {...props} />;
  };
}
