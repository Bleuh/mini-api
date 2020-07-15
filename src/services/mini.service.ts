//src/services/mini.service.ts

import { Request, Response, Express } from "express";
import User from "../database/users/users.model";
import Order from "../database/orders/orders.model";
import RequestUtil from "./requestUtil.service";
import Product from "../database/products/products.model";
import { Item } from "../database/orders/orders.types";
import { ORDERS_STATUS_PENDING } from "../constants/miniApi.constants";
import getEndpoints from "express-list-endpoints";

type requestOrders = {
  productId: string;
  quantity: number;
};

export class MiniService {
  public endPointsList(req: Request, res: Response): Response {
    return res.status(200).json(getEndpoints(<Express>req.app));
  }

  public async getOrders(req: Request, res: Response): Promise<Response> {
    try {
      const user = await User.findById(req.user?.id).exec();
      if (user) {
        const orders = await Order.find({ user }).exec();
        return res.status(200).json(orders);
      }
      return res
        .status(400)
        .json(RequestUtil.apiErrorResponse("Order not found."));
    } catch (error) {
      return res
        .status(500)
        .json(RequestUtil.apiErrorResponse("Order cannot be get.", error));
    }
  }

  public async getOrderInformation(
    req: Request,
    res: Response
  ): Promise<Response> {
    const { miss, extra, ok } = RequestUtil.checkFields(
      ["orderID"],
      Object.entries(req.body).length !== 0 ? Object.keys(req.body) : []
    );
    if (!ok) {
      return res
        .status(400)
        .json(RequestUtil.apiFieldsErrorReponse(miss, extra));
    }
    const orderID: string = req.body.orderID;
    try {
      const user = await User.findById(req.user?.id).exec();
      if (user) {
        const order = await Order.findById(orderID).exec();
        return res.status(200).json(order);
      }
      return res
        .status(400)
        .json(RequestUtil.apiErrorResponse("Order not found."));
    } catch (error) {
      return res
        .status(500)
        .json(RequestUtil.apiErrorResponse("Order cannot be get.", error));
    }
  }

  public async createOrder(req: Request, res: Response): Promise<Response> {
    const { miss, extra, ok } = RequestUtil.checkFields(
      ["orders"],
      Object.entries(req.body).length !== 0 ? Object.keys(req.body) : []
    );
    if (!ok) {
      return res
        .status(400)
        .json(RequestUtil.apiFieldsErrorReponse(miss, extra));
    }
    const orders: requestOrders[] = JSON.parse(req.body.orders);
    try {
      const user = await User.findById(req.user?.id).exec();
      if (!user) {
        return res
          .status(400)
          .json(RequestUtil.apiErrorResponse("User not found."));
      }
      const items: Item[] = [];
      let total = 0;
      await Promise.all(
        orders.map(async (order) => {
          const product = await Product.findById(order.productId).exec();
          if (product) {
            for (let index = 0; index < order.quantity; index++) {
              items.push({
                product,
              });
              total = total + product.price;
            }
          }
        })
      );
      const { discountTotal, discountName } = this.applyDiscount(total, orders);
      const order =
        discountTotal !== total
          ? await Order.create({
              user,
              items,
              total: discountTotal,
              status: ORDERS_STATUS_PENDING,
              discount: discountName,
            })
          : await Order.create({
              user,
              items,
              total,
              status: ORDERS_STATUS_PENDING,
            });
      return res
        .status(200)
        .json(
          RequestUtil.apiSuccessResponse("Orders received.", order.toJSON())
        );
    } catch (error) {
      return res
        .status(500)
        .json(RequestUtil.apiErrorResponse("Order cannot be create.", error));
    }
  }

  private applyDiscount(
    total: number,
    items: requestOrders[]
  ): { discountTotal: number; discountName: string } {
    const quantities = items.reduce(
      (accumulator, currentValue) => accumulator + currentValue.quantity,
      0
    );
    if (quantities > 50) {
      return {
        discountTotal: total * 0.6,
        discountName: "More that 50 pieces",
      };
    }
    // familly pack ?????
    return { discountTotal: total, discountName: "" };
  }
}
