//src/main.controller.ts

import { Application, Response, Request, NextFunction, Errback } from "express";
import { MiniService } from "./services/mini.service";
import { AuthService } from "./services/auth.service";
import { FactoryService } from "./services/factory.service";

export class Controller {
  private miniService: MiniService;
  private authService: AuthService;
  private factoryService: FactoryService;

  constructor(private app: Application) {
    this.miniService = new MiniService();
    this.authService = new AuthService();
    this.factoryService = new FactoryService();
    this.routes();
  }

  public routes(): void {
    //List of endpoint available
    this.app
      .route("/")
      .all((req, res) => this.miniService.endPointsList(req, res));

    //Auth
    this.app
      .route("/register")
      .post((req, res) => this.authService.register(req, res));
    this.app
      .route("/login")
      .post((req, res) => this.authService.login(req, res));

    //Middleware user auth
    this.app.use(
      "/order/*",
      this.authService.requireJWTAuthentication(),
      (err: Errback, req: Request, res: Response, next: NextFunction) => {
        if (err.name === "UnauthorizedError") {
          res
            .status(401)
            .json({ message: "Unauthorized. Invalid or missing token!" });
        }
        next('route');
      }
    );

    //User routes
    this.app
      .route("/order/create")
      .post((req, res) => this.miniService.createOrder(req, res));
    this.app
      .route("/order/list")
      .post((req, res) => this.miniService.getOrders(req, res));
    this.app
      .route("/order/status")
      .post((req, res) => this.miniService.getOrderInformation(req, res));

    //Factory routes
    this.app
      .route("/factory/order/new-orders")
      .post((req, res) => this.factoryService.getNewOrders(req, res));
    this.app
      .route("/factory/order/set-serial")
      .post((req, res) => this.factoryService.setSerial(req, res));
    this.app
      .route("/factory/order/update-status")
      .post((req, res) => this.factoryService.updateStatus(req, res));
  }
}
