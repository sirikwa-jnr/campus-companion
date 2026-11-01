"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    // This sends the reset email. It points to our /update-password page.
    const redirectUrl = `${window.location.origin}/update-password`;
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Check your email for the reset link!");
    }
    setLoading(false);
  }

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <Card className="p-6 w-full max-w-sm">
        <h1 className="text-xl font-semibold mb-4">Reset Password</h1>
        <p className="text-sm text-muted-foreground mb-4">
          Enter your email and we will send you a link to reset your password.
        </p>
        
        <form onSubmit={handleReset} className="space-y-3">
          <div>
            <Label className="text-xs">Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          
          {error && <p className="text-xs text-red-600">{error}</p>}
          {message && <p className="text-xs text-green-600">{message}</p>}
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending..." : "Send reset link"}
          </Button>
        </form>
        
        <p className="text-xs text-muted-foreground mt-4 text-center">
          Remembered it? <Link href="/login" className="text-primary hover:underline">Back to login</Link>
        </p>
      </Card>
    </div>
  );
}