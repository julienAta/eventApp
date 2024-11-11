"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isAuthenticated, logout } from "@/lib/authService";

export function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoggedIn(isAuthenticated());
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const userData = await response.json();
      console.log("User data:", userData);

      if (userData.role === "admin") {
        setIsAdmin(true);
        return;
      } else {
        setIsAdmin(false);
        return;
      }
    };

    checkAuthStatus();
    // Add event listener for storage changes
    window.addEventListener("storage", checkAuthStatus);

    return () => {
      window.removeEventListener("storage", checkAuthStatus);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    router.push("/auth");
  };

  return (
    <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6 border-b">
      <Link className="mr-6 flex items-center" href="/">
        <span className="text-lg font-semibold">jjx</span>
      </Link>
      <nav className="ml-auto flex items-center gap-4 md:gap-6">
        {isLoggedIn && (
          <>
            <Link
              className="text-sm font-medium hover:underline underline-offset-4"
              href="/events"
            >
              Events
            </Link>
            <Link
              className="text-sm font-medium hover:underline underline-offset-4"
              href="/dashboard"
            >
              Dashboard
            </Link>
            <Link
              className="text-sm font-medium hover:underline underline-offset-4"
              href="/events/create"
            >
              Create
            </Link>
            {isAdmin && (
              <Link
                className="text-sm font-medium hover:underline underline-offset-4"
                href="/admin"
              >
                Admin
              </Link>
            )}
          </>
        )}
        {isLoggedIn ? (
          <Button
            variant="outline"
            onClick={handleLogout}
            className="text-sm font-medium"
          >
            Disconnect
          </Button>
        ) : (
          <Link href="/auth">
            <Button variant="outline" className="text-sm font-medium">
              Login
            </Button>
          </Link>
        )}
      </nav>
    </header>
  );
}
