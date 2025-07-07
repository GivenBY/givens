"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth, UserButton } from "@clerk/nextjs";
import { Menu, Moon, Sun, Terminal } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";
import NavLink from "../NavLink";
import { Skeleton } from "./skeleton";

export default function NavBar() {
  const { theme, setTheme } = useTheme();
  const { isSignedIn } = useAuth();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        {/* Logo */}
        {!mounted ? (
          <Skeleton className="h-6 w-28 rounded-full bg-gray-200 dark:bg-gray-700" />
        ) : (
          <Link href="/" className="flex items-center gap-2" prefetch={false}>
            <Terminal className="h-6 w-6 text-gray-800 dark:text-gray-100" />
            <span className="font-bold font-mono text-lg">Givens</span>
          </Link>
        )}

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {!mounted ? (
            <>
              <Skeleton className="h-6 w-20 rounded bg-gray-200 dark:bg-gray-700" />
              <Skeleton className="h-6 w-24 rounded bg-gray-200 dark:bg-gray-700" />
              <Skeleton className="h-6 w-24 rounded bg-gray-200 dark:bg-gray-700" />
            </>
          ) : (
            <>
              <Link
                href="/"
                className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                prefetch={false}
              >
                Editor
              </Link>
              <NavLink
                href="/analytics"
                label="Analytics"
                isSignedIn={isSignedIn}
              />
              <NavLink
                href="/mypastes"
                label="My Pastes"
                isSignedIn={isSignedIn}
              />
            </>
          )}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          {!mounted ? (
            <Skeleton className="h-9 w-9 rounded-full bg-gray-200 dark:bg-gray-700" />
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-yellow-400" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600" />
              )}
            </Button>
          )}

          {/* Auth */}
          {!mounted ? (
            <Skeleton className="h-9 w-9 rounded-full bg-gray-200 dark:bg-gray-700" />
          ) : isSignedIn ? (
            <UserButton />
          ) : (
            <Button
              asChild
              variant="outline"
              size="icon"
              className="rounded px-8 py-2 text-sm font-medium"
            >
              <Link href="/sign-in" prefetch={false} aria-label="Sign In">
                Sign In
              </Link>
            </Button>
          )}

          {/* Mobile Nav */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden rounded-full"
              >
                <Menu className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <span className="sr-only">Open Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="bottom"
              align="start"
              className="w-40 md:hidden"
            >
              <DropdownMenuItem asChild>
                <Link href="/" prefetch={false}>
                  Editor
                </Link>
              </DropdownMenuItem>
              {isSignedIn && (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/analytics" prefetch={false}>
                      Analytics
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/mypastes" prefetch={false}>
                      My Pastes
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
