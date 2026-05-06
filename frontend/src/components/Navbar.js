"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeProvider";
import {
  Moon,
  Sun,
  User,
  LogOut,
  BookOpen,
  Search,
  Settings,
  MoreVertical,
} from "lucide-react";
import { Button } from "./ui/button";
import { GlobalSearch } from "./GlobalSearch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-white/20 dark:border-white/5">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <BookOpen className="w-8 h-8 text-primary transition-transform group-hover:scale-110" />
              <span className="text-2xl font-serif font-bold tracking-tight">
                ITSABLOG
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {/* Search */}
              <Button
                variant="outline"
                className="hidden md:flex items-center gap-2 px-4"
                onClick={() => setSearchOpen(true)}
              >
                <Search size={18} />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Search...
                </span>
                <kbd className="hidden lg:inline-flex items-center gap-1 ml-2 px-2 py-0.5 text-xs font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 rounded">
                  ⌘K
                </kbd>
              </Button>

              <Link
                href="/explore"
                className="hidden lg:flex text-sm font-medium hover:text-primary"
              >
                Explore
              </Link>

              <Link
                href="/lists"
                className="hidden lg:flex text-sm font-medium hover:text-primary"
              >
                Lists
              </Link>

              <Link
                href="/clubs"
                className="hidden lg:flex text-sm font-medium hover:text-primary"
              >
                Clubs
              </Link>

              {/* Theme */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full"
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </Button>

              {/* Auth */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 hover:opacity-80">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-9 h-9 rounded-full ring-2 ring-primary/20"
                      />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => router.push("/profile")}>
                      <User size={16} className="mr-2" />
                      My Profile
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => router.push("/settings")}>
                      <Settings size={16} className="mr-2" />
                      Settings
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-3">
                  <Button variant="ghost" onClick={() => router.push("/login")}>
                    Login
                  </Button>
                  <Button
                    onClick={() => router.push("/register")}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile */}
            <div className="flex md:hidden items-center gap-3">
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
              >
                <Search size={20} />
              </Button>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical size={20} />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => router.push("/profile")}>
                      <User size={16} className="mr-2" />
                      My Profile
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => router.push("/settings")}>
                      <Settings size={16} className="mr-2" />
                      Settings
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button size="sm" onClick={() => router.push("/login")}>
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Search Modal */}
      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
};
