// Example usage of the comprehensive error handling system
// Use this as a reference for how to handle errors throughout your app

import { 
  showErrorToast, 
  showSuccessToast, 
  showLoadingToast, 
  showInfoToast,
  getErrorMessage,
  getErrorDetail,
  isBackendError 
} from "@/lib/error-handler";

// Example 1: RTK Query mutation with error handling
export function useGameMutation() {
  const [createGame, { isLoading, error }] = useCreateGameMutation();

  // Handle errors automatically
  useEffect(() => {
    if (error) {
      showErrorToast(error, "Failed to create game");
    }
  }, [error]);

  const handleCreateGame = async (gameData: GameData) => {
    try {
      const loadingToast = showLoadingToast("Creating Arena", "Setting up robot battlefield...");
      
      const result = await createGame(gameData).unwrap();
      
      showSuccessToast("Arena Created", `Game "${result.name}" is ready for combat!`);
      
      return result;
    } catch (error) {
      // Error will be handled by useEffect above
      throw error;
    }
  };

  return { handleCreateGame, isLoading };
}

// Example 2: Manual error handling for custom functions
async function connectToRobotServer() {
  try {
    const loadingToast = showLoadingToast("Connecting Robot", "Establishing neural link...");
    
    const response = await fetch("/api/robot/connect");
    
    if (!response.ok) {
      const errorData = await response.json();
      showErrorToast(errorData, "Failed to connect to robot");
      return;
    }
    
    showSuccessToast("Robot Connected", "Neural link established successfully!");
    
  } catch (error) {
    showErrorToast(error, "Connection to robot failed");
  }
}

// Example 3: Form validation errors
function handleFormSubmit(data: FormData) {
  try {
    // Validate data
    if (!data.username) {
      showErrorToast("Username is required", "Please enter a pilot name");
      return;
    }
    
    // Process form...
    showSuccessToast("Form Submitted", "Data processed successfully!");
    
  } catch (error) {
    showErrorToast(error, "Form submission failed");
  }
}

// Example 4: Checking error types manually
function customErrorHandler(error: any) {
  if (isBackendError(error)) {
    const message = getErrorMessage(error);
    const detail = getErrorDetail(error);
    
    console.log(`Backend error: ${message}`);
    console.log(`Details: ${detail}`);
    
    // Custom handling based on status
    if (error.status === 401) {
      // Redirect to login
      window.location.href = "/login";
    }
  } else {
    console.log("Non-backend error:", error);
  }
}

// Example 5: Different toast types
function showDifferentToasts() {
  // Success
  showSuccessToast("Mission Complete", "All objectives accomplished!");
  
  // Info
  showInfoToast("System Update", "Robot firmware updated to v2.1.3");
  
  // Loading (returns toast ID for dismissing)
  const loadingToast = showLoadingToast("Deploying Robot", "Preparing for battle...");
  
  // Error with action button (automatically added for 5xx errors)
  showErrorToast({
    status: 500,
    data: {
      title: "Server overload",
      status: 500,
      detail: "Too many robots in the arena"
    }
  });
}

// Example 6: Error handling in async/await chains
async function chainedOperations() {
  try {
    const loadingToast = showLoadingToast("Multi-Stage Operation", "Executing complex maneuver...");
    
    const step1 = await firstOperation();
    const step2 = await secondOperation(step1);
    const step3 = await finalOperation(step2);
    
    showSuccessToast("Operation Complete", "All stages executed successfully!");
    
    return step3;
    
  } catch (error) {
    // This will automatically parse your backend error format
    showErrorToast(error, "Multi-stage operation failed");
    throw error;
  }
}