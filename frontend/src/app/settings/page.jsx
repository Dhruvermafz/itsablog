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
} from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  const { user } = useAuth();
  const router = useRouter();

  // Edit Profile State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Issue Report State
  const [issueTitle, setIssueTitle] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [issueType, setIssueType] = useState("bug");

  // Load user data
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
        <p className="text-slate-500">Redirecting to login...</p>
      </div>
    );
  }

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

      // Update current logged-in user
      const updatedUser = { ...users[userIndex] };
      delete updatedUser.password;
      localStorage.setItem("itsablog_user", JSON.stringify(updatedUser));

      alert("Profile updated successfully!");
      window.location.reload();
    }
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill in all password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      alert("New password must be at least 6 characters");
      return;
    }

    const users = JSON.parse(localStorage.getItem("itsablog_users") || "[]");
    const currentUser = users.find((u) => u.id === user.id);

    if (!currentUser || currentUser.password !== currentPassword) {
      alert("Current password is incorrect");
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
      alert("Please provide both title and description");
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

    alert("Issue submitted successfully! We will review it shortly.");
    setIssueTitle("");
    setIssueDescription("");
    setIssueType("bug");
  };

  return (
    <div className="min-h-screen py-8" data-testid="settings-page">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-5xl">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/profile">
            <ArrowLeft className="mr-2" size={18} />
            Back to Profile
          </Link>
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-serif tracking-tight mb-2">Settings</h1>
          <p className="text-slate-600 dark:text-slate-300">
            Manage your account settings and preferences
          </p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mb-8">
            <TabsTrigger value="profile" data-testid="profile-tab">
              <User size={16} className="mr-2" />
              <span className="hidden sm:inline">Edit Profile</span>
              <span className="sm:hidden">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="password" data-testid="password-tab">
              <Lock size={16} className="mr-2" />
              <span className="hidden sm:inline">Password</span>
              <span className="sm:hidden">Pass</span>
            </TabsTrigger>
            <TabsTrigger value="issues" data-testid="issues-tab">
              <AlertCircle size={16} className="mr-2" />
              <span className="hidden sm:inline">Issues</span>
            </TabsTrigger>
            <TabsTrigger value="terms" data-testid="terms-tab">
              <FileText size={16} className="mr-2" />
              <span className="hidden sm:inline">Terms</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" data-testid="privacy-tab">
              <Shield size={16} className="mr-2" />
              <span className="hidden sm:inline">Privacy</span>
            </TabsTrigger>
          </TabsList>

          {/* ==================== EDIT PROFILE ==================== */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-2xl">
                  Edit Profile
                </CardTitle>
                <CardDescription>
                  Update your personal information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    data-testid="name-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    data-testid="email-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself and your reading interests..."
                    rows={4}
                    data-testid="bio-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="avatar">Avatar URL</Label>
                  <Input
                    id="avatar"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    data-testid="avatar-input"
                  />
                  {avatar && (
                    <div className="mt-2">
                      <img
                        src={avatar}
                        alt="Avatar preview"
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleUpdateProfile}
                  className="w-full"
                  data-testid="save-profile-button"
                >
                  <Save className="mr-2" size={18} />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ==================== CHANGE PASSWORD ==================== */}
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-2xl">
                  Change Password
                </CardTitle>
                <CardDescription>Update your account password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    data-testid="current-password-input"
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    data-testid="new-password-input"
                  />
                  <p className="text-xs text-slate-500">
                    Must be at least 6 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    data-testid="confirm-password-input"
                  />
                </div>

                <Button
                  onClick={handleChangePassword}
                  className="w-full"
                  data-testid="change-password-button"
                >
                  <Lock className="mr-2" size={18} />
                  Change Password
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ==================== REPORT ISSUE ==================== */}
          <TabsContent value="issues">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-2xl">
                  Report an Issue
                </CardTitle>
                <CardDescription>
                  Found a bug or have feedback? Let us know!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="issue-type">Issue Type</Label>
                  <select
                    id="issue-type"
                    value={issueType}
                    onChange={(e) => setIssueType(e.target.value)}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    data-testid="issue-type-select"
                  >
                    <option value="bug">Bug Report</option>
                    <option value="feature">Feature Request</option>
                    <option value="feedback">General Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="issue-title">Title</Label>
                  <Input
                    id="issue-title"
                    value={issueTitle}
                    onChange={(e) => setIssueTitle(e.target.value)}
                    placeholder="Brief description of the issue"
                    data-testid="issue-title-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="issue-description">Description</Label>
                  <Textarea
                    id="issue-description"
                    value={issueDescription}
                    onChange={(e) => setIssueDescription(e.target.value)}
                    placeholder="Please provide detailed information about the issue..."
                    rows={6}
                    data-testid="issue-description-input"
                  />
                </div>

                <Button
                  onClick={handleSubmitIssue}
                  className="w-full"
                  data-testid="submit-issue-button"
                >
                  <AlertCircle className="mr-2" size={18} />
                  Submit Issue
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
