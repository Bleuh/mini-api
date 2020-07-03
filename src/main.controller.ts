//src/main.controller.ts

import { Application } from "express";
import { MiniService } from "./services/mini.service";

export class Controller {
  private miniService: MiniService;

  constructor(private app: Application) {
    this.miniService = new MiniService();
    this.routes();
  }

  public routes() {
    this.app.route("/").get(this.miniService.welcomeMessage);
  }
}
