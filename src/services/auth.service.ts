//src/services/auth.service.ts

import { Request, Response } from "express";
import jwt from "express-jwt";
import jsonwebtoken from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../constants/miniApi.constants";

import User from "../database/users/users.model";
import { IUser } from "../database/users/users.types";
import RequestUtil from "./requestUtil.service";

export class AuthService {
  public requireJWTAuthentication(): jwt.RequestHandler {
    return jwt({
      secret: ACCESS_TOKEN_SECRET,
      algorithms: ["HS256"],
    });
  }

  public async register(req: Request, res: Response): Promise<Response> {
    const { miss, extra, ok } = RequestUtil.checkFields(
      ["login", "password"],
      Object.entries(req.body).length !== 0 ? Object.keys(req.body) : []
    );
    if (!ok) {
      return res
        .status(400)
        .json(RequestUtil.apiFieldsErrorReponse(miss, extra));
    }
    const login: string = req.body.login;
    const password: string = req.body.password;
    try {
      const user: IUser | null = await User.findOne({
        login,
      }).exec();
      if (user) {
        return res
          .status(409)
          .json(RequestUtil.apiErrorResponse("User already exist."));
      }
      const newUser: IUser = await User.create({
        login,
        password,
      });
      return res
        .status(201)
        .json(
          RequestUtil.apiSuccessResponse("User successfully created.", {
            ...newUser.toJSON(),
            password: "",
          })
        );
    } catch (error) {
      return res
        .status(500)
        .json(RequestUtil.apiErrorResponse("User cannot be created.", error));
    }
  }

  public async login(req: Request, res: Response): Promise<Response> {
    const { miss, extra, ok } = RequestUtil.checkFields(
      ["login", "password"],
      Object.entries(req.body).length !== 0 ? Object.keys(req.body) : []
    );
    if (!ok) {
      return res
        .status(400)
        .json(RequestUtil.apiFieldsErrorReponse(miss, extra));
    }
    const login: string = req.body.login;
    const password: string = req.body.password;
    try {
      const user: IUser | null = await User.findOne({
        login,
        password,
      }).exec();
      if (user) {
        const accessToken = jsonwebtoken.sign(
          { id: user.id },
          ACCESS_TOKEN_SECRET
        );
        return res
          .status(200)
          .json(RequestUtil.apiSuccessResponse("User found.", { accessToken }));
      }
      return res
        .status(404)
        .json(RequestUtil.apiErrorResponse("User not found."));
    } catch (error) {
      return res
        .status(500)
        .json(RequestUtil.apiErrorResponse("User cannot be found.", error));
    }
  }
}
