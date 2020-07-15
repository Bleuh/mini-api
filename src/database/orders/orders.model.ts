import { model } from "mongoose";
import { IOrder } from "./orders.types";
import OrderShema from "./orders.schema";
const Order = model<IOrder>("order", OrderShema);
export default Order;
