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
export function isBackendError(error: any): error is BackendError {
  return (
    error &&
    typeof error === "object" &&
    typeof error.status === "number" &&
    error.data &&
    typeof error.data === "object" &&
    typeof error.data.title === "string" &&
    typeof error.data.status === "number" &&
    typeof error.data.detail === "string"
  );
}

// Extract error message with fallback
export function getErrorMessage(error: any): string {
  if (isBackendError(error)) {
    return error.data.title;
  }

  // Fallback for other error formats
  if (error?.message) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "An unexpected error occurred";
}

// Extract error detail with fallback
export function getErrorDetail(error: any): string | undefined {
  if (isBackendError(error)) {
    return error.data.detail;
  }

  return undefined;
}

// Get error status code
export function getErrorStatus(error: any): number | undefined {
  if (isBackendError(error)) {
    return error.status;
  }

  return undefined;
}

// Comprehensive error toast handler with gaming theme
export function showErrorToast(error: any, fallbackMessage?: string) {
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
export function showSuccessToast(message: string, description?: string) {
  toast.success(`⚡ ${message.toUpperCase()}`, {
    description: description || "Operation completed successfully",
  });
}

// Loading toast helper with gaming theme
export function showLoadingToast(message: string, description?: string) {
  return toast.loading(`🤖 ${message.toUpperCase()}`, {
    description: description || "Processing request...",
  });
}

// Info toast helper with gaming theme
export function showInfoToast(message: string, description?: string) {
  toast.info(`💡 ${message.toUpperCase()}`, {
    description: description,
  });
}

// Dismiss all toasts
export function dismissAllToasts() {
  toast.dismiss();
}
