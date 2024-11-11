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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

      if (userData.role === "admin") {
        setIsAdmin(true);
        return;
      } else {
        setIsAdmin(false);
        return;
      }
    };

    checkAuthStatus();
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6 border-b relative z-50">
      <Link className="mr-6 flex items-center" href="/">
        <span className="text-lg font-semibold">JUNBI</span>
      </Link>
      <nav
        className={`ml-auto  items-center gap-4 md:gap-6 hidden ${
          isMenuOpen ? "hidden" : "flex"
        } md:flex`}
      >
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
      <div className="ml-4 md:hidden">
        <Button variant="ghost" onClick={toggleMenu}>
          <svg
            className={`h-6 w-6 transition-transform duration-300 ${
              isMenuOpen ? "rotate-90" : ""
            }`}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 6H20M4 12H20M4 18H20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
      </div>

      {isMenuOpen && (
        <div className="absolute top-20 left-0 w-full bg-white shadow-lg px-4 py-2">
          <nav className="flex flex-col items-start gap-2">
            {isLoggedIn && (
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
                {isAdmin && (
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
            {isLoggedIn ? (
              <Button
                variant="outline"
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="text-sm font-medium"
              >
                Disconnect
              </Button>
            ) : (
              <Link href="/auth" onClick={toggleMenu}>
                <Button variant="outline" className="text-sm font-medium">
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
