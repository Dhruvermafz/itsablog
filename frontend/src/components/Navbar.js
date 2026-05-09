"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeProvider";

import {
  Moon,
  Sun,
  User,
  LogOut,
  BookOpen,
  Search,
  Settings,
  MoreHorizontal,
  Compass,
  List,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { GlobalSearch } from "@/components/GlobalSearch";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Navbar = () => {
  const { user, logout, loading, isAuthenticated } = useAuth();

  const { theme, toggleTheme } = useTheme();

  const router = useRouter();

  const pathname = usePathname();

  const [searchOpen, setSearchOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const profileUrl = user?.username ? `/u/${user.username}` : "/login";

  const initials =
    user?.username
      ?.split(" ")
      ?.map((word) => word[0])
      ?.join("")
      ?.slice(0, 2)
      ?.toUpperCase() || "U";

  const navLinks = [
    {
      href: "/explore",
      label: "Explore",
    },
    {
      href: "/lists",
      label: "Lists",
    },
    {
      href: "/clubs",
      label: "Clubs",
    },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/75 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-primary/10 text-primary border border-primary/10 transition-all duration-300 group-hover:scale-105 group-hover:bg-primary/15">
                <BookOpen className="w-5 h-5" />
              </div>

              <div className="flex flex-col leading-none">
                <span className="text-xl md:text-2xl font-bold tracking-tight font-serif">
                  ITSABLOG
                </span>

                <span className="hidden md:block text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  Read • Review • Reflect
                </span>
              </div>
            </Link>

            {/* Desktop */}
            <div className="hidden md:flex items-center gap-5">
              {/* Search */}
              <Button
                variant="outline"
                onClick={() => setSearchOpen(true)}
                className="rounded-full px-4 border-border/60 bg-background/60 hover:bg-muted"
              >
                <Search size={16} />

                <span className="ml-2 text-sm text-muted-foreground">
                  Search books...
                </span>

                <kbd className="ml-3 hidden lg:inline-flex h-6 items-center rounded-md border bg-muted px-2 text-[10px] font-mono text-muted-foreground">
                  ⌘K
                </kbd>
              </Button>

              {/* Nav Links */}
              <div className="flex items-center gap-1">
                {navLinks.map((link) => {
                  const active = pathname === link.href;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        active
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              {/* Theme */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </Button>

              {/* Auth */}
              {!loading && isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="outline-none">
                      <Avatar className="h-10 w-10 ring-2 ring-primary/20 transition-transform hover:scale-105">
                        <AvatarImage src={user?.avatar} alt={user?.username} />

                        <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-56 rounded-2xl">
                    <div className="px-3 py-2">
                      <p className="font-semibold">{user?.username}</p>

                      <p className="text-xs text-muted-foreground truncate">
                        {user?.email}
                      </p>
                    </div>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={() => router.push(profileUrl)}>
                      <User className="mr-2 h-4 w-4" />
                      My Profile
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => router.push("/settings")}>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-500 focus:text-red-500"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                !loading && (
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      onClick={() => router.push("/login")}
                    >
                      Login
                    </Button>

                    <Button
                      onClick={() => router.push("/register")}
                      className="rounded-full"
                    >
                      Join Now
                    </Button>
                  </div>
                )
              )}
            </div>

            {/* Mobile Top Navbar */}
            <div className="flex md:hidden items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
              >
                <Search size={20} />
              </Button>

              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </Button>

              {!loading && isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted transition-colors">
                      <MoreHorizontal size={22} />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-56 rounded-2xl">
                    <div className="px-3 py-2">
                      <p className="font-semibold">{user?.username}</p>

                      <p className="text-xs text-muted-foreground truncate">
                        {user?.email}
                      </p>
                    </div>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={() => router.push("/settings")}>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-500 focus:text-red-500"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                !loading && (
                  <Button
                    size="sm"
                    className="rounded-full"
                    onClick={() => router.push("/login")}
                  >
                    Login
                  </Button>
                )
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navbar */}
      <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-1 px-3 py-2 rounded-2xl border border-border/50 bg-background/80 backdrop-blur-xl shadow-xl">
          <button
            onClick={() => router.push("/explore")}
            className={`flex flex-col items-center justify-center px-4 py-2 rounded-xl transition-all ${
              pathname === "/explore"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Compass size={18} />

            <span className="text-[10px] mt-1">Explore</span>
          </button>

          <button
            onClick={() => router.push("/lists")}
            className={`flex flex-col items-center justify-center px-4 py-2 rounded-xl transition-all ${
              pathname === "/lists"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <List size={18} />

            <span className="text-[10px] mt-1">Lists</span>
          </button>

          <button
            onClick={() => router.push("/clubs")}
            className={`flex flex-col items-center justify-center px-4 py-2 rounded-xl transition-all ${
              pathname === "/clubs"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users size={18} />

            <span className="text-[10px] mt-1">Clubs</span>
          </button>

          <button
            onClick={() => router.push(profileUrl)}
            className={`flex flex-col items-center justify-center px-4 py-2 rounded-xl transition-all ${
              pathname === profileUrl
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {isAuthenticated ? (
              <Avatar className="h-5 w-5">
                <AvatarImage src={user?.avatar} alt={user?.username} />

                <AvatarFallback className="text-[10px] bg-primary text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
            ) : (
              <User size={18} />
            )}

            <span className="text-[10px] mt-1">Profile</span>
          </button>
        </div>
      </div>

      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
};
