import { Schema } from "mongoose";
const ProductSchema = new Schema({
  name: String,
  price: Number,
});
export default ProductSchema;
