declare global {
  namespace NodeJS {
    interface ProcessEnv {
      botToken: string;
      guildId?: string;
      environment: "dev" | "prod" | "debug";
      prefix?: string;
      LavalinkURL: string;
      LavalinkPassword: string;
    }
  }
}

export { };
