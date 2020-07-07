//src/services/mini.service.ts

import { Request, Response } from "express";
import { WELCOME_MESSAGE } from "../constants/miniApi.constants";
import User from "../database/users/users.model";

export class MiniService {
  public async welcomeMessage(req: Request, res: Response): Promise<Response> {
    console.log(req.user?.id);
    const user = await User.findById(req.user?.id).exec()
    return res.status(200).json({message: `your login is ${user?.login}`});
  }
}
