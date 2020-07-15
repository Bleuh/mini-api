import { model } from "mongoose";
import { IProduct } from "./products.types";
import ProductSchema from "./products.schema";
const Product = model<IProduct>("product", ProductSchema);
export default Product;
