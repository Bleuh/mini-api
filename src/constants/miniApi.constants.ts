//src/constants/hezflixApi.constants.ts

export const PORT = process.env.PORT || 3000;
export const MONGO_URL = "mongodb://mongodb:27017/data";
export const ACCESS_TOKEN_SECRET = "test";
export const ORDERS_STATUS_PENDING = "Pending";
export const ORDERS_STATUS_PRODUCTION = "Production";
export const ORDERS_STATUS_COMPLETE = "Complete";
export const ORDERS_STATUS_SHIPPED = "Shipped";
declare global {
  interface ParsedToken {
    id: string;
    iat: number;
  }

  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: ParsedToken;
    }
  }
}
