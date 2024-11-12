"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { logout, getUser, refreshToken } from "@/lib/authService";
import { Menu } from "lucide-react"; // Using lucide icon instead of raw SVG

interface User {
  id: string;
  email: string;
  role: string;
  // Add other user properties
}

export function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Try to get user data
        const userData = await getUser();

        if (!userData) {
          // If no user data, try to refresh token
          try {
            await refreshToken();
            // Verify the refresh worked by getting user data again
            const refreshedUserData = await getUser();
            setUser(refreshedUserData);
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            setUser(null);
          }
        } else {
          setUser(userData);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();

    // Listen for storage events (e.g., logout in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "accessToken" && !e.newValue) {
        setUser(null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      router.push("/auth");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Show loading state
  if (isLoading) {
    return (
      <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6 border-b">
        <div className="w-full flex justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
        </div>
      </header>
    );
  }

  return (
    <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6 border-b relative z-50 bg-background">
      <Link className="mr-6 flex items-center" href="/">
        <span className="text-lg font-semibold">JUNBI</span>
      </Link>

      {/* Desktop Navigation */}
      <nav className="ml-auto hidden md:flex items-center gap-6">
        {user && (
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
            {user.role === "admin" && (
              <Link
                className="text-sm font-medium hover:underline underline-offset-4"
                href="/admin"
              >
                Admin
              </Link>
            )}
          </>
        )}

        {user ? (
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

      {/* Mobile Menu Button */}
      <div className="ml-auto md:hidden">
        <Button variant="ghost" size="icon" onClick={toggleMenu}>
          <Menu
            className={`h-5 w-5 transition-transform duration-200 ${
              isMenuOpen ? "rotate-90" : ""
            }`}
          />
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-background border-b shadow-lg animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col p-4 gap-4">
            {user && (
              <>
                <Link
                  className="text-sm font-medium hover:underline underline-offset-4"
                  href="/events"
                  onClick={toggleMenu}
                >
                  Events
                </Link>
                <Link
                  className="text-sm font-medium hover:underline underline-offset-4"
                  href="/dashboard"
                  onClick={toggleMenu}
                >
                  Dashboard
                </Link>
                <Link
                  className="text-sm font-medium hover:underline underline-offset-4"
                  href="/events/create"
                  onClick={toggleMenu}
                >
                  Create
                </Link>
                {user.role === "admin" && (
                  <Link
                    className="text-sm font-medium hover:underline underline-offset-4"
                    href="/admin"
                    onClick={toggleMenu}
                  >
                    Admin
                  </Link>
                )}
              </>
            )}
            {user ? (
              <Button
                variant="outline"
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="text-sm font-medium w-full"
              >
                Disconnect
              </Button>
            ) : (
              <Link href="/auth" onClick={toggleMenu} className="w-full">
                <Button
                  variant="outline"
                  className="text-sm font-medium w-full"
                >
                  Login
                </Button>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
