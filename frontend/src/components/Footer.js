import React from "react";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export const Footer = () => {
  return (
    <footer
      className="mt-24 border-t border-border bg-card/60 backdrop-blur-sm"
      data-testid="footer"
    >
      <div className="container mx-auto px-4 md:px-8 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <BookOpen className="w-7 h-7 text-primary transition-transform group-hover:scale-110" />

              <span className="text-2xl font-bold tracking-tight font-serif">
                ITSABLOG
              </span>
            </Link>

            <p className="text-muted-foreground text-sm leading-7">
              A modern reading and writing space crafted for book lovers,
              thinkers, and storytellers.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground font-mono">
            © {new Date().getFullYear()} ITSABLOG. Built with passion for books.
          </p>

          <div className="flex items-center gap-5 text-sm text-muted-foreground">
            <Link
              href="/privacy"
              className="hover:text-primary transition-colors"
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="hover:text-primary transition-colors"
            >
              Terms
            </Link>

            <Link
              href="/contact"
              className="hover:text-primary transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
