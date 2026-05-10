"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Save, Camera, Loader2 } from "lucide-react";

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

import { useUpdateProfileMutation } from "@/api/userApi";

export default function EditProfile({ user }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    bio: "",
    avatar: "",
  });

  const [message, setMessage] = useState("");

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        bio: user.bio || "",
        avatar: user.avatar || "",
      });
    }
  }, [user]);

  const initials = useMemo(() => {
    return (
      formData.username
        ?.split(" ")
        ?.map((word) => word[0])
        ?.join("")
        ?.slice(0, 2)
        ?.toUpperCase() || "U"
    );
  }, [formData.username]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdateProfile = async () => {
    try {
      setMessage("");

      const payload = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        bio: formData.bio.trim(),
        avatar: formData.avatar.trim(),
      };

      await updateProfile(payload).unwrap();

      setMessage("Profile updated successfully!");
    } catch (error) {
      console.error(error);

      setMessage(error?.data?.message || "Failed to update profile.");
    }
  };

  return (
    <Card className="rounded-3xl border-border/50 shadow-sm">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl">Public Profile</CardTitle>

        <CardDescription>
          This information will appear publicly on your profile.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Avatar */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="relative w-fit">
            <Avatar className="h-28 w-28 ring-4 ring-primary/10">
              <AvatarImage
                src={formData.avatar}
                alt={formData.username}
                className="object-cover"
              />

              <AvatarFallback className="text-3xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
              <Camera className="h-4 w-4" />
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <Label htmlFor="avatar">Profile Photo URL</Label>

            <Input
              id="avatar"
              value={formData.avatar}
              onChange={(e) => handleChange("avatar", e.target.value)}
              placeholder="https://example.com/avatar.jpg"
              className="h-11 rounded-xl"
            />
          </div>
        </div>

        <Separator />

        {/* Username + Email */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>

            <Input
              id="username"
              value={formData.username}
              onChange={(e) => handleChange("username", e.target.value)}
              placeholder="johndoe"
              className="h-11 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>

            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="john@example.com"
              className="h-11 rounded-xl"
            />
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>

          <Textarea
            id="bio"
            rows={6}
            maxLength={300}
            value={formData.bio}
            onChange={(e) => handleChange("bio", e.target.value)}
            placeholder="Tell readers a little about yourself..."
            className="rounded-2xl resize-none"
          />

          <p className="text-xs text-muted-foreground text-right">
            {formData.bio.length}/300
          </p>
        </div>

        {/* Message */}
        {message && (
          <div className="rounded-2xl border bg-muted/40 px-4 py-3 text-sm">
            {message}
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleUpdateProfile}
            disabled={isLoading}
            className="h-11 rounded-xl px-6"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
