"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  User,
  Lock,
  AlertCircle,
  FileText,
  Shield,
  Save,
  Camera,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

import { Separator } from "@/components/ui/separator";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function SettingsPage() {
  const { user } = useAuth();

  const router = useRouter();

  // Profile
  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [bio, setBio] = useState("");

  const [avatar, setAvatar] = useState("");

  // Password
  const [currentPassword, setCurrentPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  // Issues
  const [issueTitle, setIssueTitle] = useState("");

  const [issueDescription, setIssueDescription] = useState("");

  const [issueType, setIssueType] = useState("bug");

  useEffect(() => {
    if (user) {
      setName(user.name || "");

      setEmail(user.email || "");

      setBio(user.bio || "");

      setAvatar(user.avatar || "");
    } else {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Redirecting to login...</p>
      </div>
    );
  }

  const initials =
    name
      ?.split(" ")
      ?.map((n) => n[0])
      ?.join("")
      ?.slice(0, 2)
      ?.toUpperCase() || "U";

  const handleUpdateProfile = () => {
    const users = JSON.parse(localStorage.getItem("itsablog_users") || "[]");

    const userIndex = users.findIndex((u) => u.id === user.id);

    if (userIndex >= 0) {
      users[userIndex] = {
        ...users[userIndex],
        name,
        email,
        bio,
        avatar,
      };

      localStorage.setItem("itsablog_users", JSON.stringify(users));

      const updatedUser = {
        ...users[userIndex],
      };

      delete updatedUser.password;

      localStorage.setItem("itsablog_user", JSON.stringify(updatedUser));

      alert("Profile updated successfully!");

      window.location.reload();
    }
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    const users = JSON.parse(localStorage.getItem("itsablog_users") || "[]");

    const currentUser = users.find((u) => u.id === user.id);

    if (!currentUser || currentUser.password !== currentPassword) {
      alert("Current password incorrect");
      return;
    }

    const userIndex = users.findIndex((u) => u.id === user.id);

    users[userIndex].password = newPassword;

    localStorage.setItem("itsablog_users", JSON.stringify(users));

    alert("Password changed successfully!");

    setCurrentPassword("");

    setNewPassword("");

    setConfirmPassword("");
  };

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
    <div className="min-h-screen py-10">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-6xl">
        {/* Back */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-serif tracking-tight mb-3">
            Account Settings
          </h1>

          <p className="text-muted-foreground max-w-2xl">
            Customize your reading identity, update your account, and manage
            your ITSABLOG experience.
          </p>
        </div>

        <Tabs
          defaultValue="profile"
          className="grid lg:grid-cols-[260px_1fr] gap-8"
        >
          {/* Sidebar */}
          <TabsList className="flex lg:flex-col h-fit bg-transparent gap-2 justify-start overflow-x-auto lg:overflow-visible p-0">
            <TabsTrigger
              value="profile"
              className="justify-start rounded-2xl px-4 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <User className="mr-2 h-4 w-4" />
              Edit Profile
            </TabsTrigger>

            <TabsTrigger
              value="password"
              className="justify-start rounded-2xl px-4 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Lock className="mr-2 h-4 w-4" />
              Password
            </TabsTrigger>

            <TabsTrigger
              value="issues"
              className="justify-start rounded-2xl px-4 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <AlertCircle className="mr-2 h-4 w-4" />
              Report Issue
            </TabsTrigger>

            <TabsTrigger
              value="terms"
              className="justify-start rounded-2xl px-4 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <FileText className="mr-2 h-4 w-4" />
              Terms
            </TabsTrigger>

            <TabsTrigger
              value="privacy"
              className="justify-start rounded-2xl px-4 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Shield className="mr-2 h-4 w-4" />
              Privacy
            </TabsTrigger>
          </TabsList>

          {/* PROFILE */}
          <TabsContent value="profile">
            <Card className="rounded-3xl border-border/50 bg-card/70 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-3xl font-serif">
                  Your Profile
                </CardTitle>

                <CardDescription>
                  Update your public identity and reader profile.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-8">
                {/* Avatar */}
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="relative">
                    <Avatar className="w-28 h-28 ring-4 ring-primary/10">
                      <AvatarImage src={avatar} />

                      <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>

                    <div className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                      <Camera size={16} />
                    </div>
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    <Label>Avatar URL</Label>

                    <Input
                      value={avatar}
                      onChange={(e) => setAvatar(e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <Separator />

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Full Name</Label>

                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>

                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Bio</Label>

                  <Textarea
                    rows={6}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell readers about yourself..."
                    className="resize-none"
                  />
                </div>

                <Button onClick={handleUpdateProfile} className="rounded-xl">
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PASSWORD */}
          <TabsContent value="password">
            <Card className="rounded-3xl border-border/50 bg-card/70 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-3xl font-serif">Security</CardTitle>

                <CardDescription>
                  Update your password and secure your account.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Current Password</Label>

                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>New Password</Label>

                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />

                  <p className="text-xs text-muted-foreground">
                    Use at least 6 characters.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Confirm Password</Label>

                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <Button
                  onClick={handleChangePassword}
                  variant="destructive"
                  className="rounded-xl"
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Change Password
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ISSUES */}
          <TabsContent value="issues">
            <Card className="rounded-3xl border-border/50 bg-card/70 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-3xl font-serif">
                  Report an Issue
                </CardTitle>

                <CardDescription>
                  Help improve ITSABLOG with your feedback.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Issue Type</Label>

                  <select
                    value={issueType}
                    onChange={(e) => setIssueType(e.target.value)}
                    className="w-full h-11 rounded-xl border border-input bg-background px-4 text-sm"
                  >
                    <option value="bug">Bug Report</option>

                    <option value="feature">Feature Request</option>

                    <option value="feedback">Feedback</option>

                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Title</Label>

                  <Input
                    value={issueTitle}
                    onChange={(e) => setIssueTitle(e.target.value)}
                    placeholder="Issue title"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>

                  <Textarea
                    rows={7}
                    value={issueDescription}
                    onChange={(e) => setIssueDescription(e.target.value)}
                    placeholder="Describe the issue..."
                  />
                </div>

                <Button onClick={handleSubmitIssue} className="rounded-xl">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Submit Issue
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TERMS */}
          <TabsContent value="terms">
            <Card className="rounded-3xl border-border/50 bg-card/70 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="font-serif text-3xl">
                  Terms & Conditions
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4 text-muted-foreground leading-7">
                <p>
                  By using ITSABLOG, you agree to respect the community and
                  share content responsibly.
                </p>

                <p>
                  Users are responsible for the content they publish and the
                  lists they curate.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PRIVACY */}
          <TabsContent value="privacy">
            <Card className="rounded-3xl border-border/50 bg-card/70 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="font-serif text-3xl">
                  Privacy Policy
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4 text-muted-foreground leading-7">
                <p>
                  Your information is stored securely and never shared publicly
                  without consent.
                </p>

                <p>
                  ITSABLOG only uses your profile information to improve your
                  reading experience.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
