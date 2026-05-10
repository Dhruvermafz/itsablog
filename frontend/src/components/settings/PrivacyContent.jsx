"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyContent() {
  return (
    <Card className="rounded-3xl border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Privacy Policy</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-muted-foreground leading-7">
        <p>
          Your data is stored securely and never shared publicly without your
          permission.
        </p>
        <p>
          ITSABLOG uses your profile information only to improve your reading
          and community experience.
        </p>
        <p>
          You can update or remove your profile information at any time from
          this page.
        </p>
      </CardContent>
    </Card>
  );
}
