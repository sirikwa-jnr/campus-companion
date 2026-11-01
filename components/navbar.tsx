"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { SyncIndicator } from "@/components/sync-indicator";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/timetable", label: "Timetable" },
    { href: "/assignments", label: "Assignments" },
    { href: "/gpa", label: "GPA" },
    { href: "/notes", label: "Notes" },
    { href: "/units", label: "Units" },
    { href: "/settings", label: "Settings" },
  ];

  return (
    <nav className="border-b">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-6">
        
        {/* Logo */}
        <Link href="/" className="font-semibold">
          Campus Companion
        </Link>

        {/* Desktop Links (Hidden on Mobile) */}
        <div className="hidden md:flex gap-4 text-sm text-muted-foreground flex-1 overflow-x-auto whitespace-nowrap">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Side: Sync, Theme, and Mobile Toggle */}
        <div className="flex items-center gap-3 md:gap-4">
          <SyncIndicator />
          <ThemeToggle />
          
          {/* Mobile Toggle Button */}
          <button
            className="md:hidden p-1"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden flex flex-col gap-4 px-4 pt-2 pb-4 border-t bg-background text-sm font-medium">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="hover:text-foreground text-muted-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}