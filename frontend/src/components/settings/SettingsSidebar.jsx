"use client";

import React from "react";
import {
  User,
  Lock,
  AlertTriangle,
  FileText,
  Shield,
  ChevronRight,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function SettingsSidebar({ activeTab, setActiveTab, user }) {
  const initials =
    user?.name
      ?.split(" ")
      ?.map((n) => n[0])
      ?.join("")
      ?.slice(0, 2)
      ?.toUpperCase() || "U";

  const navItems = [
    { value: "profile", label: "Profile", icon: User },
    { value: "security", label: "Security", icon: Lock },
    { value: "issues", label: "Report Issue", icon: AlertTriangle },
    { value: "terms", label: "Terms", icon: FileText },
    { value: "privacy", label: "Privacy", icon: Shield },
  ];

  return (
    <aside>
      <Card className="rounded-3xl border-border/50 shadow-sm sticky top-8 overflow-hidden">
        {/* User Info */}
        <div className="p-6 border-b">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 ring-4 ring-primary/10">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="text-lg font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h3 className="font-semibold truncate">{user?.name}</h3>
              <p className="text-sm text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="p-3 flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.value;

            return (
              <button
                key={item.value}
                onClick={() => setActiveTab(item.value)}
                className={`w-full flex items-center justify-between rounded-2xl px-4 py-3 h-12 text-left transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="flex items-center">
                  <Icon className="mr-3 h-4 w-4" />
                  <span>{item.label}</span>
                </div>
                <ChevronRight className="h-4 w-4 opacity-60" />
              </button>
            );
          })}
        </div>
      </Card>
    </aside>
  );
}
