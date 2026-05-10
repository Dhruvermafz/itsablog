"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsContent() {
  return (
    <Card className="rounded-3xl border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Terms & Conditions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-muted-foreground leading-7">
        <p>
          By using ITSABLOG, you agree to use the platform responsibly and
          respectfully.
        </p>
        <p>
          Users are responsible for the content they publish, reviews they
          write, and lists they curate.
        </p>
        <p>
          We reserve the right to moderate content that violates platform
          guidelines.
        </p>
      </CardContent>
    </Card>
  );
}
