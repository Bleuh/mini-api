//src/main.controller.ts

import { Application } from "express";
import { MiniService } from "./services/mini.service";
import { AuthService } from "./services/auth.service";

export class Controller {
  private miniService: MiniService;
  private authService: AuthService;

  constructor(private app: Application) {
    this.miniService = new MiniService();
    this.authService = new AuthService();
    this.routes();
  }

  public routes(): void {
    this.app.route("/").get(
      this.authService.requireJWTAuthentication(),
      (req, res) => this.miniService.welcomeMessage(req, res)
    );
    this.app.route("/user/register")
      .get(
        (req, res) => this.authService.register(req, res)
      );
    this.app.route("/user/login")
      .get(
        (req, res) => this.authService.login(req, res)
      );
  }
}
