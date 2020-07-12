import { Document } from "mongoose";
import { IUser } from "../users/users.types";
import { IProduct } from "../products/products.types";
import {
  ORDERS_STATUS_PENDING,
  ORDERS_STATUS_PRODUCTION,
  ORDERS_STATUS_COMPLETE,
  ORDERS_STATUS_SHIPPED,
} from "../../constants/miniApi.constants";

export type Status =
  | typeof ORDERS_STATUS_PENDING
  | typeof ORDERS_STATUS_PRODUCTION
  | typeof ORDERS_STATUS_COMPLETE
  | typeof ORDERS_STATUS_SHIPPED;

export type Item = {
  _id?: string;
  product: IProduct;
  serial?: string;
};

export interface IOrder extends Document {
  user: IUser;
  items: Item[];
  status: Status;
  total: number;
  discount?: string;
}
