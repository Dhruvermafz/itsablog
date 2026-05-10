"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";

import SettingsSidebar from "@/components/settings/SettingsSidebar";
import EditProfile from "@/components/settings/EditProfile";
import SecuritySettings from "@/components/settings/SecuritySettings";
import ReportIssue from "@/components/settings/ReportIssue";
import TermsContent from "@/components/settings/TermsContent";
import PrivacyContent from "@/components/settings/PrivacyContent";

export default function SettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => router.push("/")}
              className="flex items-center text-sm hover:underline mb-3 -ml-1"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </button>
            <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground mt-2">
              Manage your account and preferences
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          <SettingsSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            user={user}
          />

          <section className="space-y-6">
            {activeTab === "profile" && <EditProfile user={user} />}
            {activeTab === "security" && <SecuritySettings user={user} />}
            {activeTab === "issues" && <ReportIssue user={user} />}
            {activeTab === "terms" && <TermsContent />}
            {activeTab === "privacy" && <PrivacyContent />}
          </section>
        </div>
      </div>
    </div>
  );
}
