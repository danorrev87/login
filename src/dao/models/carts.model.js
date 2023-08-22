import mongoose from "mongoose";
import { cartsCollection } from "../../constants/index.js";

import './products.model.js';

const cartSchema = new mongoose.Schema({
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products' 
        },
        quantity: {
            type: Number,
            required: true,
            default: 1
        }
    }]
});

export const cartsModel = mongoose.model(cartsCollection, cartSchema);
