import React from "react";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export const Footer = () => {
  return (
    <footer
      className="mt-24 border-t border-border bg-card/60 backdrop-blur-sm"
      data-testid="footer"
    >
      <div className="container mx-auto px-4 md:px-8 lg:px-12 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo + Description */}
          <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                <BookOpen className="w-6 h-6 text-primary transition-transform duration-300 group-hover:scale-110" />
              </div>

              <span className="text-2xl font-bold tracking-tight font-serif text-foreground">
                ITSABLOG
              </span>
            </Link>
          </div>

          {/* Links */}
          <div className="flex items-center gap-5 text-sm text-muted-foreground">
            <p className="text-sm text-muted-foreground max-w-md">
              © {new Date().getFullYear()} ITSABLOG — Built with passion for
              books and storytelling.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
