import React, { createContext, useContext, useMemo } from "react";
import type AppServices from "../services";
import { appsServiceClient } from "../lib/config";

interface AppServiceContextState {
  clientApi: AppServices;
}

const AppServiceContext = createContext<AppServiceContextState | null>(null);

export const useAppService = () => {
  const ctx = useContext(AppServiceContext);
  if (!ctx) {
    throw new Error("useAppService must be used within a AppServiceProvider");
  }
  return ctx;
};

interface AppServiceProviderProps {
  baseUrl: string;
  children: React.ReactNode;
  /**
   * Authentication token
   */
  apiKey?: string;
  /**
   * PublishableApiKey identifier that defines the scope of resources
   * available within the request
   */
  publishableApiKey?: string;
}

export const AppServiceProvider = ({ children }: AppServiceProviderProps) => {
  const value = useMemo(
    () => ({
      clientApi: appsServiceClient,
    }),
    [appsServiceClient]
  );

  return (
    <AppServiceContext.Provider value={value}>
      {children}
    </AppServiceContext.Provider>
  );
};
