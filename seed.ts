import mongoose from "mongoose";
import Product from "./src/database/products/products.model";

Product.create({ _id: mongoose.Types.ObjectId('56cb91bdc3464f14678934ca'), name: "mini-figure", price: 15 });