//src/app.ts

import express, { Application } from "express";

//importing our controller
import { Controller } from "./main.controller";
import bodyParser from "body-parser";
import cors from "cors";

class App {
  public app: Application;

  //declaring our controller
  public mainController: Controller;

  constructor() {
    this.app = express();
    this.setConfig();

    //Creating and assigning a new instance of our controller
    this.mainController = new Controller(this.app);
  }

  private setConfig() {
    this.app.use(bodyParser.json({ limit: "50mb" }));
    this.app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
    this.app.use(cors());
  }
}

export default new App().app;
