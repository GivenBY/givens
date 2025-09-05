"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Menu, Terminal } from "lucide-react";
import { useState } from "react";
import { ThemeSelector } from "./themeSelector";
import { usePrismTheme } from "@/hooks/usePrismTheme";

export default function Navbar() {
    const [theme, setTheme] = useState("default");
    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/explore", label: "Explore" },
        { href: "/my-pastes", label: "My Pastes" },
    ];
    usePrismTheme(theme);

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
                    {navLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-3">
                    <ThemeSelector value={theme} onChange={setTheme} />
                    <Button variant="outline" size="icon" className="px-8 hover:bg-muted">
                        SignIn
                    </Button>

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
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.label}
                                        href={link.href}
                                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
