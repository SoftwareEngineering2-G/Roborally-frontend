import * as signalR from "@microsoft/signalr";
import { SignalRConnectionState, SignalRConfig } from "@/types/signalr";

class SignalRConnectionManager {
  private connection: signalR.HubConnection | null = null;
  private config: SignalRConfig | null = null;
  private connectionState: SignalRConnectionState =
    SignalRConnectionState.Disconnected;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  // Event listeners
  private stateChangeListeners: ((state: SignalRConnectionState) => void)[] =
    [];
  private eventHandlers: Map<string, ((data: any) => void)[]> = new Map();
  private errorHandlers: ((error: Error) => void)[] = [];

  // Singleton instance
  private static instance: SignalRConnectionManager | null = null;

  private constructor() {}

  public static getInstance(): SignalRConnectionManager {
    if (!SignalRConnectionManager.instance) {
      SignalRConnectionManager.instance = new SignalRConnectionManager();
    }
    return SignalRConnectionManager.instance;
  }

  public initialize(config: SignalRConfig): void {
    if (this.connection) {
      console.warn("SignalR connection already initialized");
      return;
    }

    this.config = config;
    this.createConnection();
  }

  private createConnection(): void {
    if (!this.config) {
      throw new Error("SignalR config not provided");
    }

    const {
      baseUrl,
      hubPath,
      automaticReconnect = true,
      reconnectDelays,
      accessTokenFactory,
    } = this.config;

    const connectionBuilder = new signalR.HubConnectionBuilder()
      .withUrl(`${baseUrl}${hubPath}`, {
        accessTokenFactory: accessTokenFactory,
      })
      .configureLogging(signalR.LogLevel.Information);

    if (automaticReconnect) {
      connectionBuilder.withAutomaticReconnect(
        reconnectDelays || [0, 2000, 10000, 30000]
      );
    }

    this.connection = connectionBuilder.build();
    this.setupConnectionHandlers();
  }

  private setupConnectionHandlers(): void {
    if (!this.connection) return;

    // Connection state handlers
    this.connection.onclose((error) => {
      this.updateConnectionState(SignalRConnectionState.Disconnected);
      if (error) {
        this.notifyError(new Error(`Connection closed: ${error.message}`));
      }
    });

    this.connection.onreconnecting(() => {
      this.updateConnectionState(SignalRConnectionState.Reconnecting);
      this.reconnectAttempts++;
    });

    this.connection.onreconnected(() => {
      this.updateConnectionState(SignalRConnectionState.Connected);
      this.reconnectAttempts = 0;
      console.log("SignalR reconnected successfully");
    });
  }

  public async start(): Promise<void> {
    if (!this.connection) {
      throw new Error("Connection not initialized. Call initialize() first.");
    }

    if (this.connectionState === SignalRConnectionState.Connected) {
      console.log("SignalR already connected");
      return;
    }

    try {
      this.updateConnectionState(SignalRConnectionState.Connecting);
      await this.connection.start();
      this.updateConnectionState(SignalRConnectionState.Connected);
      console.log("SignalR connected successfully");
    } catch (error) {
      this.updateConnectionState(SignalRConnectionState.Disconnected);
      const signalRError = new Error(
        `Failed to start SignalR connection: ${(error as Error).message}`
      );
      this.notifyError(signalRError);
      throw signalRError;
    }
  }

  public async stop(): Promise<void> {
    if (
      !this.connection ||
      this.connectionState === SignalRConnectionState.Disconnected
    ) {
      return;
    }

    try {
      this.updateConnectionState(SignalRConnectionState.Disconnecting);
      await this.connection.stop();
      this.updateConnectionState(SignalRConnectionState.Disconnected);
      console.log("SignalR disconnected successfully");
    } catch (error) {
      this.notifyError(
        new Error(
          `Failed to stop SignalR connection: ${(error as Error).message}`
        )
      );
    }
  }

  public getConnectionState(): SignalRConnectionState {
    return this.connectionState;
  }

  public isConnected(): boolean {
    return this.connectionState === SignalRConnectionState.Connected;
  }

  // Event subscription methods
  public on<T = any>(eventName: string, handler: (data: T) => void): void {
    if (!this.connection) {
      throw new Error("Connection not initialized");
    }

    // Store handler for cleanup
    if (!this.eventHandlers.has(eventName)) {
      this.eventHandlers.set(eventName, []);
    }
    this.eventHandlers.get(eventName)!.push(handler);

    // Register with SignalR
    this.connection.on(eventName, handler);
  }

  public off(eventName: string, handler?: (data: any) => void): void {
    if (!this.connection) return;

    if (handler) {
      // Remove specific handler
      const handlers = this.eventHandlers.get(eventName);
      if (handlers) {
        const index = handlers.indexOf(handler);
        if (index > -1) {
          handlers.splice(index, 1);
        }
      }
      this.connection.off(eventName, handler);
    } else {
      // Remove all handlers for event
      this.eventHandlers.delete(eventName);
      this.connection.off(eventName);
    }
  }

  // Group methods for lobby functionality
  public async joinLobby(gameId: string): Promise<void> {
    if (!this.connection || !this.isConnected()) {
      throw new Error("SignalR connection not available");
    }

    try {
      await this.connection.invoke("JoinLobby", gameId);
      console.log(`Joined lobby: ${gameId}`);
    } catch (error) {
      const joinError = new Error(
        `Failed to join lobby ${gameId}: ${(error as Error).message}`
      );
      this.notifyError(joinError);
      throw joinError;
    }
  }

  public async leaveLobby(gameId: string): Promise<void> {
    if (!this.connection || !this.isConnected()) {
      return; // Silently fail if not connected
    }

    try {
      await this.connection.invoke("LeaveLobby", gameId);
      console.log(`Left lobby: ${gameId}`);
    } catch (error) {
      const leaveError = new Error(
        `Failed to leave lobby ${gameId}: ${(error as Error).message}`
      );
      this.notifyError(leaveError);
      // Don't throw here, as leaving a group on disconnect is not critical
    }
  }

  // Send methods for various actions
  public async sendToGroup<T = any>(
    groupName: string,
    eventName: string,
    data: T
  ): Promise<void> {
    if (!this.connection || !this.isConnected()) {
      throw new Error("SignalR connection not available");
    }

    try {
      await this.connection.invoke("SendToGroup", groupName, eventName, data);
    } catch (error) {
      const sendError = new Error(
        `Failed to send to group ${groupName}: ${(error as Error).message}`
      );
      this.notifyError(sendError);
      throw sendError;
    }
  }

  public async invoke<T = any>(methodName: string, ...args: any[]): Promise<T> {
    if (!this.connection || !this.isConnected()) {
      throw new Error("SignalR connection not available");
    }

    try {
      return await this.connection.invoke<T>(methodName, ...args);
    } catch (error) {
      const invokeError = new Error(
        `Failed to invoke ${methodName}: ${(error as Error).message}`
      );
      this.notifyError(invokeError);
      throw invokeError;
    }
  }

  // Event listener management
  public onStateChange(
    handler: (state: SignalRConnectionState) => void
  ): () => void {
    this.stateChangeListeners.push(handler);

    // Return unsubscribe function
    return () => {
      const index = this.stateChangeListeners.indexOf(handler);
      if (index > -1) {
        this.stateChangeListeners.splice(index, 1);
      }
    };
  }

  public onError(handler: (error: Error) => void): () => void {
    this.errorHandlers.push(handler);

    // Return unsubscribe function
    return () => {
      const index = this.errorHandlers.indexOf(handler);
      if (index > -1) {
        this.errorHandlers.splice(index, 1);
      }
    };
  }

  private updateConnectionState(newState: SignalRConnectionState): void {
    if (this.connectionState === newState) return;

    this.connectionState = newState;
    this.stateChangeListeners.forEach((listener) => {
      try {
        listener(newState);
      } catch (error) {
        console.error("Error in state change listener:", error);
      }
    });
  }

  private notifyError(error: Error): void {
    this.errorHandlers.forEach((handler) => {
      try {
        handler(error);
      } catch (handlerError) {
        console.error("Error in error handler:", handlerError);
      }
    });
  }

  // Cleanup method
  public cleanup(): void {
    this.eventHandlers.clear();
    this.stateChangeListeners.length = 0;
    this.errorHandlers.length = 0;

    if (this.connection) {
      this.connection.stop();
      this.connection = null;
    }
  }
}

// Export singleton instance
export const signalRConnection = SignalRConnectionManager.getInstance();

// Export class for testing purposes
export { SignalRConnectionManager };
