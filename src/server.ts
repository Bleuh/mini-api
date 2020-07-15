//src/server.ts

import * as dotenv from "dotenv";
dotenv.config();

import app from "./app";
import connect from "./connect";
import {
  PORT,
  MONGO_URL
} from "./constants/miniApi.constants";

connect({ db: MONGO_URL });

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
