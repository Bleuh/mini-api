//src/services/factory.service.ts

import { Request, Response } from "express";
import Order from "../database/orders/orders.model";
import {
  ORDERS_STATUS_PENDING,
  ORDERS_STATUS_PRODUCTION,
} from "../constants/miniApi.constants";
import RequestUtil from "./requestUtil.service";
import { Status } from "../database/orders/orders.types";

export class FactoryService {
  public async getNewOrders(req: Request, res: Response): Promise<Response> {
    const orders = await Order.find({ status: ORDERS_STATUS_PENDING });
    try {
      await Promise.all(
        orders.map(async (order) => {
          order.status = ORDERS_STATUS_PRODUCTION;
          await order.save();
        })
      );
      return res
        .status(200)
        .json(RequestUtil.apiSuccessResponse("New orders found.", { orders }));
    } catch (error) {
      return res
        .status(500)
        .json(RequestUtil.apiErrorResponse("Cannot get new orders.", error));
    }
  }

  public async setSerial(req: Request, res: Response): Promise<Response> {
    const { miss, extra, ok } = RequestUtil.checkFields(
      ["orderID", "serials"],
      Object.entries(req.body).length !== 0 ? Object.keys(req.body) : []
    );
    if (!ok) {
      return res
        .status(400)
        .json(RequestUtil.apiFieldsErrorReponse(miss, extra));
    }
    const orderID: string = req.body.orderID;
    const serials: Record<string, string> = JSON.parse(req.body.serials);
    try {
      const order = await Order.findById(orderID).exec();
      if (!order) {
        return res
          .status(404)
          .json(RequestUtil.apiErrorResponse("Order not found."));
      }
      try {
        await Promise.all(
          order.items.map(async (item, index) => {
            if (item._id && serials[item._id]) {
              order.items[index].serial = serials[item._id];
            }
          })
        );
        await order.save();
        return res
          .status(200)
          .json(
            RequestUtil.apiSuccessResponse(
              "Serial successfully set.",
              order.toJSON()
            )
          );
      } catch (error) {
        return res
          .status(500)
          .json(
            RequestUtil.apiErrorResponse(
              `Cannot update order ${orderID}`,
              error
            )
          );
      }
    } catch (error) {
      return res
        .status(500)
        .json(
          RequestUtil.apiErrorResponse(`Cannot get order ${orderID}`, error)
        );
    }
  }

  public async updateStatus(req: Request, res: Response): Promise<Response> {
    const { miss, extra, ok } = RequestUtil.checkFields(
      ["orderID", "status"],
      Object.entries(req.body).length !== 0 ? Object.keys(req.body) : []
    );
    if (!ok) {
      return res
        .status(400)
        .json(RequestUtil.apiFieldsErrorReponse(miss, extra));
    }
    const orderID: string = req.body.orderID;
    const status: Status = req.body.status;
    if (!this.checkStatus(status)) {
      return res
        .status(500)
        .json(RequestUtil.apiErrorResponse(`Invalide status "${status}".`));
    }
    try {
      const order = await Order.findById(orderID).exec();
      if (!order) {
        return res
          .status(404)
          .json(RequestUtil.apiErrorResponse("Order not found."));
      }
      order.status = status;
      await order.save();
      return res
        .status(200)
        .json(
          RequestUtil.apiSuccessResponse(
            "Order status successfully updated.",
            order.toJSON()
          )
        );
    } catch (error) {
      return res
        .status(500)
        .json(
          RequestUtil.apiErrorResponse(`Cannot update order ${orderID}`, error)
        );
    }
  }

  private checkStatus(status: string): boolean {
    return (
      status === "Pending" ||
      status === "Production" ||
      status === "Complete" ||
      status === "Shipped"
    );
  }
}
