/// Global env types
type ExtendedProcessEnv = {
  PORT?: string;
  BLOCKCHAIN_WSS_URL: string;
  POSTGRES_DATABASE_URL: string;
  SECURA_CONTRACT_ADDRESS: string;
  NODE_ENV: "production" | "development";
};

declare module NodeJS {
  interface ProcessEnv extends ExtendedProcessEnv {}
}
type SecuraEnv = keyof ExtendedProcessEnv;
