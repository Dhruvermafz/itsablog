"use client";

import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ReportIssue({ user }) {
  const [issueTitle, setIssueTitle] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [issueType, setIssueType] = useState("bug");

  const handleSubmitIssue = () => {
    if (!issueTitle.trim() || !issueDescription.trim()) {
      alert("Please complete all fields");
      return;
    }

    const issues = JSON.parse(localStorage.getItem("itsablog_issues") || "[]");

    issues.push({
      id: "issue" + Date.now(),
      userId: user.id,
      userName: user.name,
      type: issueType,
      title: issueTitle.trim(),
      description: issueDescription.trim(),
      status: "open",
      createdAt: new Date().toISOString(),
    });

    localStorage.setItem("itsablog_issues", JSON.stringify(issues));

    alert("Issue submitted successfully!");
    setIssueTitle("");
    setIssueDescription("");
    setIssueType("bug");
  };

  return (
    <Card className="rounded-3xl border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Report an Issue</CardTitle>
        <CardDescription>
          Found a bug or have a feature idea? Let us know.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Issue Type</Label>
          <select
            value={issueType}
            onChange={(e) => setIssueType(e.target.value)}
            className="w-full h-11 rounded-xl border border-input bg-background px-4 text-sm outline-none"
          >
            <option value="bug">Bug Report</option>
            <option value="feature">Feature Request</option>
            <option value="feedback">Feedback</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label>Issue Title</Label>
          <Input
            value={issueTitle}
            onChange={(e) => setIssueTitle(e.target.value)}
            placeholder="Short summary of the issue"
            className="h-11 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            rows={7}
            value={issueDescription}
            onChange={(e) => setIssueDescription(e.target.value)}
            placeholder="Describe the issue in detail..."
            className="rounded-2xl resize-none"
          />
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSubmitIssue} className="rounded-xl h-11 px-6">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Submit Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
