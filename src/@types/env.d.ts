/// Global env types
type ExtendedProcessEnv = {
  PORT?: string;
  POSTGRES_DATABASE_URL: string;
  NODE_ENV: "production" | "development";
};

declare module NodeJS {
  interface ProcessEnv extends ExtendedProcessEnv {}
}
type SecuraEnv = keyof ExtendedProcessEnv;
