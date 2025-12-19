import { toast } from "sonner";

// Type definitions for your backend error structure
export interface BackendError {
  status: number;
  data: {
    title: string;
    status: number;
    detail: string;
  };
}

// Type guard to check if error matches your backend format
/**
 * @author Sachin Baral 2025-10-01 21:43:01 +0200 14
 */
export function isBackendError(error: unknown): error is BackendError {
  if (!error || typeof error !== "object" || error === null) {
    return false;
  }

  const err = error as Record<string, unknown>;

  if (
    typeof err.status !== "number" ||
    !err.data ||
    typeof err.data !== "object" ||
    err.data === null
  ) {
    return false;
  }

  const data = err.data as Record<string, unknown>;

  return (
    typeof data.title === "string" &&
    typeof data.status === "number" &&
    typeof data.detail === "string"
  );
}

// Extract error message with fallback
/**
 * @author Sachin Baral 2025-10-01 21:43:01 +0200 35
 */
export function getErrorMessage(error: unknown): string {
  if (isBackendError(error)) {
    return error.data.title;
  }

  // Fallback for other error formats
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  ) {
    return (error as Record<string, unknown>).message as string;
  }

  if (typeof error === "string") {
    return error;
  }

  return "An unexpected error occurred";
}

// Extract error detail with fallback
/**
 * @author Sachin Baral 2025-10-01 21:43:01 +0200 53
 */
export function getErrorDetail(error: unknown): string | undefined {
  if (isBackendError(error)) {
    return error.data.detail;
  }

  return undefined;
}

// Get error status code
/**
 * @author Sachin Baral 2025-10-01 21:43:01 +0200 62
 */
export function getErrorStatus(error: unknown): number | undefined {
  if (isBackendError(error)) {
    return error.status;
  }

  return undefined;
}

// Comprehensive error toast handler with gaming theme
/**
 * @author Sachin Baral 2025-10-01 21:43:01 +0200 71
 */
export function showErrorToast(error: unknown, fallbackMessage?: string) {
  const title = getErrorMessage(error);
  const detail = getErrorDetail(error);
  const status = getErrorStatus(error);

  // Gaming-themed error message based on status code
  let gamingTitle = title;
  let gamingDetail = detail;

  if (status) {
    switch (status) {
      case 400:
        gamingTitle = "🚨 INVALID COMMAND";
        gamingDetail = title;
        break;
      case 401:
        gamingTitle = "🔒 ACCESS DENIED";
        gamingDetail = "Pilot credentials rejected";
        break;
      case 403:
        gamingTitle = "⛔ RESTRICTED AREA";
        gamingDetail = "Insufficient clearance level";
        break;
      case 404:
        gamingTitle = "🔍 RESOURCE NOT FOUND";
        gamingDetail = "Target not detected in system";
        break;
      case 409:
        gamingTitle = "⚠️ CONFLICT DETECTED";
        gamingDetail = title;
        break;
      case 422:
        gamingTitle = "📝 VALIDATION FAILED";
        gamingDetail = title;
        break;
      case 500:
        gamingTitle = "💥 SYSTEM MALFUNCTION";
        gamingDetail = "Internal server error - Contact tech support";
        break;
      case 503:
        gamingTitle = "🔧 SERVERS OFFLINE";
        gamingDetail = "RoboRally systems temporarily unavailable";
        break;
      default:
        gamingTitle = `🤖 ERROR ${status}`;
        gamingDetail = title;
    }
  }

  toast.error(gamingTitle, {
    description: gamingDetail || fallbackMessage,
    action:
      status && status >= 500
        ? {
            label: "Retry",
            onClick: () => window.location.reload(),
          }
        : undefined,
  });
}

// Success toast helper with gaming theme
/**
 * @author Sachin Baral 2025-09-16 11:52:02 +0200 133
 */
export function showSuccessToast(message: string, description?: string) {
  toast.success(`⚡ ${message.toUpperCase()}`, {
    description: description || "Operation completed successfully",
  });
}

// Loading toast helper with gaming theme
/**
 * @author Sachin Baral 2025-09-16 11:52:02 +0200 140
 */
export function showLoadingToast(message: string, description?: string) {
  return toast.loading(`🤖 ${message.toUpperCase()}`, {
    description: description || "Processing request...",
  });
}

// Info toast helper with gaming theme
/**
 * @author Sachin Baral 2025-09-16 11:52:02 +0200 147
 */
export function showInfoToast(message: string, description?: string) {
  toast.info(`💡 ${message.toUpperCase()}`, {
    description: description,
  });
}

// Dismiss all toasts
/**
 * @author Sachin Baral 2025-09-16 11:52:02 +0200 154
 */
export function dismissAllToasts() {
  toast.dismiss();
}
