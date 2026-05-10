"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export const Layout = ({ children }) => {
  const pathname = usePathname();

  const hideNavbarRoutes = ["/login", "/register", "/forgot-password"];

  const shouldHideNavbar = hideNavbarRoutes.includes(pathname);

  return (
    <div className="min-h-screen flex flex-col">
      {!shouldHideNavbar && <Navbar />}

      <main className="flex-1">{children}</main>
    </div>
  );
};
