import { Component, type ErrorInfo, type ReactNode } from "react";
import { logError } from "@/lib/logger";

type ErrorBoundaryProps = {
  children: ReactNode;
  componentName?: string;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
  };

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logError(
      error,
      {
        channel: "react.errorBoundary",
        componentStack: errorInfo.componentStack,
      },
      this.props.componentName ?? "ErrorBoundary"
    );
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "2rem", fontFamily: "monospace", color: "red" }}>
          <h2>Something went wrong in {this.props.componentName ?? "App"}.</h2>
          <p>Check the browser console for details.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;