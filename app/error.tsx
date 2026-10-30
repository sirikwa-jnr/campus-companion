"use client";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 space-y-3">
      <h1 className="text-xl font-semibold">Page error</h1>
      <p className="text-sm text-muted-foreground max-w-md">
        {error.message || "An unexpected error occurred."}
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}