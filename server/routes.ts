import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // Application routes can be added here if needed
  // All application data is hardcoded in the frontend components
  // No backend storage or database operations needed

  const httpServer = createServer(app);

  return httpServer;
}
