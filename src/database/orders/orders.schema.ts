import { Schema } from "mongoose";
import ProductSchema from "../products/products.schema";
import UserSchema from "../users/users.schema";

const OrdersSchema = new Schema({
  user: UserSchema,
  items: [{
    _id: {
      type: Schema.Types.ObjectId,
      index: true,
      required: true,
      auto: true,
    },
    product: ProductSchema,
    serial: String
  }],
  status: String,
  total: Number,
  discount: String,
});
export default OrdersSchema;
