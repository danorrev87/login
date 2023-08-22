import { cartsModel } from "../../models/carts.model.js";

export class CartManagerMongo {
    constructor() {
        this.model = cartsModel;
    };

    async getAll() {
        try {
            const carts = await this.model.find();
            return carts;
        } catch (error) {
            throw error;
        }
    };

    async getById(cartId) {
        try {
            const cart = await this.model.findById(cartId).populate('products');
            if (!cart) {
                throw new Error("Cart not found");
            }
            return cart;
        } catch (error) {
            throw error;
        }
    };

    async save() {
        try {
            const cartCreated = await this.model.create({});
            return cartCreated;
        } catch (error) {
            throw error;
        }
    };

    async addProduct(cartId, productId) {
        try {
            const cart = await this.model.findById(cartId);
            if (!cart) {
                throw new Error("Cart not found");
            }
            const productIndex = cart.products.findIndex(p => p.productId.toString() === productId.toString());

            if (productIndex !== -1) {
                cart.products[productIndex].quantity += 1;
            } else {
                cart.products.push({ productId, quantity: 1 });
            }

            await cart.save();
            return cart;
        } catch (error) {
            throw error;
        }
    };

    async update(cartId, updateData) {
        try {
            const cartUpdated = await this.model.updateOne({ _id: cartId }, updateData);
            if (!cartUpdated) {
                throw new Error("Cart not found or update failed");
            }
            return cartUpdated;
        } catch (error) {
            throw error;
        }
    };

    async updateProductQuantity(cartId, productId, quantity) {
        try {
            // Encuentra el carrito por ID
            const cart = await this.model.findById(cartId);
            if (!cart) {
                throw new Error("Cart not found");
            }
    
            // Busca el producto en el carrito y actualiza su cantidad
            const productIndex = cart.products.findIndex(p => p.toString() === productId);
            if (productIndex === -1) {
                // Si el producto no está en el carrito, agrégalo
                cart.products.push({ _id: productId, quantity });
            } else {
                // Si el producto ya está en el carrito, actualiza su cantidad
                cart.products[productIndex].quantity = quantity;
            }
    
            // Guarda los cambios en el carrito
            await cart.save();
            return cart;
        } catch (error) {
            throw error;
        }
    }
    
};