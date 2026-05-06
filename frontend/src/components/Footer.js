import React from "react";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export const Footer = () => {
  return (
    <footer
      className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 mt-24"
      data-testid="footer"
    >
      <div className="container mx-auto px-4 md:px-8 lg:px-12 py-12">
        {/* Bottom Bar */}
        <div className="border-t border-slate-200 dark:border-slate-800 mt-8 pt-8 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400 font-mono">
            © 2024 ITSABLOG. Built with passion for books.
          </p>
        </div>
      </div>
    </footer>
  );
};
