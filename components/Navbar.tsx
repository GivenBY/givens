"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { usePrismTheme } from "@/hooks/usePrismTheme";
import { signOut, useSession } from "@/lib/auth-client";
import { Menu, Terminal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ThemeSelector } from "./themeSelector";

export default function Navbar() {
    const [theme, setTheme] = useState("default");
    const { data: session } = useSession();
    const router = useRouter();
    usePrismTheme(theme);

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/explore", label: "Explore" },
        { href: "/mypastes", label: "My Pastes" },
    ];

    const handleMyPastesClick = (e: React.MouseEvent) => {
        if (!session) {
            e.preventDefault();
            toast.error("Please sign in to view your pastes");
        } else {
            router.push("/mypastes");
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background text-foreground shadow-sm">
            <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
                <Link
                    href="/"
                    className="flex items-center gap-2 font-semibold text-foreground hover:text-primary transition-colors"
                >
                    <Terminal className="h-6 w-6" />
                    <span className="font-mono text-lg font-bold">Givens</span>
                </Link>
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                    {navLinks.map((link) =>
                        link.label === "My Pastes" ? (
                            <button
                                key={link.label}
                                onClick={handleMyPastesClick}
                                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent border-none"
                            >
                                {link.label}
                            </button>
                        ) : (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {link.label}
                            </Link>
                        )
                    )}
                </nav>

                <div className="flex items-center gap-3">
                    <ThemeSelector value={theme} onChange={setTheme} />

                    {!session ? (
                        <Link
                            href="/auth"
                            className="px-4 hover:bg-muted border rounded-md text-sm font-medium transition-colors bg-secondary/70 text-foreground border-border h-10 flex items-center justify-center"
                        >
                            Sign In
                        </Link>
                    ) : (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Avatar className="h-9 w-9 cursor-pointer">
                                    <AvatarImage src={session.user.image ?? ""} />
                                    <AvatarFallback>
                                        {session.user.name?.[0] ?? session.user.email[0]}
                                    </AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                <DropdownMenuLabel>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{session.user.name ?? "User"}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {session.user.email}
                                        </span>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/mypastes">My Pastes</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() => signOut()}
                                >
                                    Sign Out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full md:hidden hover:bg-muted"
                            >
                                <Menu className="h-6 w-6 text-muted-foreground" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            side="left"
                            className="md:hidden bg-sidebar text-sidebar-foreground border-r border-sidebar-border"
                        >
                            <nav className="grid gap-4 p-4">
                                {navLinks.map((link) =>
                                    link.label === "My Pastes" ? (
                                        <Link
                                            key={link.label}
                                            href={link.href}
                                            onClick={handleMyPastesClick}
                                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                        >
                                            {link.label}
                                        </Link>
                                    ) : (
                                        <Link
                                            key={link.label}
                                            href={link.href}
                                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    )
                                )}
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
