import AppServices from "../services";

const appsServiceClient = new AppServices({
  baseUrl:
    import.meta.env.MODE === "development"
      ? import.meta.env.VITE_PUBLIC_BACKEND_URL!
      : "/api/v1",
  maxRetries: 0,
});

export { appsServiceClient };
