//src/services/auth.service.ts

import { Request, Response } from "express";
import jwt from "express-jwt";
import jsonwebtoken from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../constants/miniApi.constants";

import User from "../database/users/users.model";
import { IUser } from "../database/users/users.types";
import RequestUtil from "./requestUtil.service";

export class AuthService {
  private reqUtil: RequestUtil;

  constructor() {
    this.reqUtil = new RequestUtil();
  }

  public requireJWTAuthentication(): jwt.RequestHandler {
    return jwt({
      secret: ACCESS_TOKEN_SECRET,
      algorithms: ["HS256"],
    });
  }

  public async register(req: Request, res: Response): Promise<Response> {
    const { miss, extra, ok } = this.reqUtil.checkFields(
      ["login", "password"],
      Object.entries(req.body).length !== 0 ? Object.keys(req.body) : []
    );
    if (!ok) {
      return res
        .status(400)
        .json(this.reqUtil.apiFieldsErrorReponse(miss, extra));
    }
    try {
      const user: IUser | null = await User.findOne(
        { login: req.body.login }
      ).exec();
      if (user) {
        return res.status(409).json(this.reqUtil.apiErrorResponse("User already exist"));
      }
      try {
        const user: IUser = await User.create({login: req.body.login, password: req.body.password});
        return res.status(201).json(this.reqUtil.apiSuccessResponse("User successully created", user.toJSON()));
      } catch (err) {
        return res.status(404).json(this.reqUtil.apiErrorResponse('User can not be create.'));
      }
    } catch (err) {
      return res.status(404).json(this.reqUtil.apiErrorResponse('User can not be create.'));
    }
  }

  public async login(req: Request, res: Response): Promise<Response> {
    const { miss, extra, ok } = this.reqUtil.checkFields(
      ["login", "password"],
      Object.entries(req.body).length !== 0 ? Object.keys(req.body) : []
    );
    if (!ok) {
      return res
        .status(400)
        .json(this.reqUtil.apiFieldsErrorReponse(miss, extra));
    }
    try {
      const user: IUser | null = await User.findOne(
        { login: req.body.login, password: req.body.password }
      ).exec();
      if (user) {
        const accessToken = jsonwebtoken.sign({ id: user.id }, ACCESS_TOKEN_SECRET);
        return res.status(200).json(this.reqUtil.apiSuccessResponse("User find", {accessToken}));
      }
      else {
        return res.status(404).json(this.reqUtil.apiErrorResponse('User not be find.'));
      }
    } catch (error) {
      return res.status(404).json(this.reqUtil.apiErrorResponse('User can not be find.'));
    }
  }
}
