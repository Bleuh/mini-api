//src/constants/hezflixApi.constants.ts

export const PORT = process.env.PORT || 3000;
export const WELCOME_MESSAGE = "Welcome to the official mini REST API";
export const MONGO_URL = "mongodb://mongodb:27017/data";
export const ACCESS_TOKEN_SECRET = "test";

declare global {
  interface ParsedToken {
    id: string
    iat: number
  }

  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: ParsedToken
    }
  }
}