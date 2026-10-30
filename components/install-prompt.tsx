"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [hidden, setHidden] = useState(
    typeof window !== "undefined" &&
      localStorage.getItem("install_dismissed") === "1"
  );

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!deferred || hidden) return null;

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    if (outcome === "accepted") {
      setDeferred(null);
    }
  }

  function dismiss() {
    localStorage.setItem("install_dismissed", "1");
    setHidden(true);
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50">
      <div className="bg-card border rounded-lg shadow-lg p-3 flex items-start gap-3">
        <span className="text-xl">📲</span>
        <div className="flex-1">
          <p className="text-sm font-medium">Install Campus Companion</p>
          <p className="text-xs text-muted-foreground">
            Add to your home screen for fast, offline access.
          </p>
          <div className="flex gap-2 mt-2">
            <button
              onClick={install}
              className="text-xs px-3 py-1 rounded bg-primary text-primary-foreground"
            >
              Install
            </button>
            <button
              onClick={dismiss}
              className="text-xs px-3 py-1 rounded hover:bg-accent"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}