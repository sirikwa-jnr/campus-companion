"use client";

import { Component, type ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}
interface State {
  hasError: boolean;
  message?: string;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error) {
    console.error("App error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card className="p-6 text-center space-y-3">
          <h2 className="font-semibold">Something went wrong</h2>
          <p className="text-sm text-muted-foreground">
            {this.state.message ?? "An unexpected error occurred."}
          </p>
          <div className="flex gap-2 justify-center">
            <Button onClick={() => this.setState({ hasError: false })}>
              Try again
            </Button>
            <Button variant="outline" onClick={() => location.reload()}>
              Reload
            </Button>
          </div>
        </Card>
      );
    }
    return this.props.children;
  }
}