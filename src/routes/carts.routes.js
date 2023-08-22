// // Importamos los módulos necesarios
// import express from 'express';
// import CartManager from '../dao/managers/fileSystem/cartManager.js';

// // Inicializamos el enrutador de Express y el administrador de carritos de compra
// const router = express.Router();
// const cartManager = new CartManager('./carts.json');

// // Definimos una ruta para obtener un carrito de compras específico por ID
// router.get('/:cid', async (req, res) => {
//     const { cid } = req.params;
//     try {
//         // Intentamos obtener el carrito y lo enviamos en la respuesta
//         const cart = await cartManager.getCartById(parseInt(cid));
//         res.status(200).send(cart);
//     } catch (error) {
//         // En caso de error, lo registramos y enviamos un mensaje de error en la respuesta
//         console.error('Error getting cart:', error);
//         res.status(404).send('Cart not found');
//     }
// });

// // Definimos una ruta para crear un nuevo carrito de compras
// router.post('/', async (req, res) => {
//     try {
//         // Intentamos crear el carrito y enviamos el ID del nuevo carrito en la respuesta
//         const newId = await cartManager.createCart();
//         res.status(200).send(`Cart with id ${newId} created successfully.`);
//     } catch (error) {
//         // En caso de error, lo registramos y enviamos un mensaje de error en la respuesta
//         console.error('Error creating cart:', error);
//         res.status(500).send('Error creating cart');
//     }
// });

// // Definimos una ruta para agregar un producto a un carrito de compras específico
// router.post('/:cid/product/:pid', async (req, res) => {
//     const { cid, pid } = req.params;
//     try {
//         // Intentamos agregar el producto al carrito y enviamos un mensaje de éxito en la respuesta
//         await cartManager.addProductToCart(parseInt(cid), parseInt(pid));
//         res.status(200).send(`Product with id ${pid} added to cart ${cid} successfully.`);
//     } catch (error) {
//         // En caso de error, lo registramos y enviamos un mensaje de error en la respuesta
//         console.error('Error adding product to cart:', error);
//         res.status(500).send('Error adding product to cart');
//     }
// });

// // Exportamos el enrutador para usarlo en otros módulos
// export default router;
import { Router } from "express";
import { cartService, productService } from "../dao/index.js";

const router = Router();

router.post("/", async (req, res) => {
    try {
        const cartCreated = await cartService.save();
        res.json({ status: "success", data: cartCreated });
    } catch (error) {
        res.json({ status: "error", message: error.message });
    }
});

router.get("/:cid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartService.getById(cartId); // Esta función ahora ya incluye el .populate('products')
        res.json({ status: "success", data: cart });
    } catch (error) {
        res.json({ status: "error", message: error.message });
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const updatedCart = await cartService.addProduct(cartId, productId);
        res.json({ status: "success", data: updatedCart });
    } catch (error) {
        res.json({ status: "error", message: error.message });
    }
});

router.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const cart = await cartService.removeProduct(cartId, productId);
        res.json({ status: "success", data: cart });
    } catch (error) {
        res.json({ status: "error", message: error.message });
    }
});

router.put("/:cid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const products = req.body.products;
        const updatedCart = await cartService.updateCart(cartId, products);
        res.json({ status: "success", data: updatedCart });
    } catch (error) {
        res.json({ status: "error", message: error.message });
    }
});

router.put("/:cid/products/:pid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity;
        const updatedCart = await cartService.updateProductQuantity(cartId, productId, quantity);
        res.json({ status: "success", data: updatedCart });
    } catch (error) {
        res.json({ status: "error", message: error.message });
    }
});

router.delete("/:cid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        await cartService.clearCart(cartId);
        res.json({ status: "success", message: "Cart cleared successfully" });
    } catch (error) {
        res.json({ status: "error", message: error.message });
    }
});



export default router;