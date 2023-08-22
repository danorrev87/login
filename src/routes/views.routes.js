import express from 'express';
import { productService } from '../dao/index.js';
import { cartService } from '../dao/index.js';
import { checkUserAuthenticated, showLoginView } from "../dao/middlewares/auth.js";


// Creamos un nuevo enrutador de express
export const router = express.Router();

// Creamos una nueva instancia de ProductManager, pasando la ruta al archivo JSON donde se almacenarán los productos
// const productManager = new ProductManager('./products.json');

// Creamos una ruta GET para '/home' utilizando FileSystem
// router.get('/home', async (req, res) => {
//     try {
//         // Obtenemos todos los productos
//         const products = await productManager.getProducts();
//         // Renderizamos la vista 'home', pasando los productos y el archivo de estilo
//         res.render('home', { products, style: 'home.css' });
//     } catch (error) {
//         // Si hay un error, lo devolvemos en la respuesta
//         res.send({ error: error.message });
//     }
// });

// Creamos una ruta GET para '/' para mostrar el login
router.get("/", showLoginView, (req,res)=>{
    res.render("login");
});

// Creamos una ruta GET para '/registro' para mostrar el registro
router.get("/registro",showLoginView,(req,res)=>{
    res.render("signup");
});

// Creamos una ruta GET para '/perfil' para mostrar el perfil del usuario
router.get("/perfil", checkUserAuthenticated, (req,res)=>{
    console.log(req.session);
    res.render("profile",{user: req.session.userInfo});
});

// Creamos una ruta GET para '/home' utilizando MongoDB
router.get('/home', async (req, res) => {
    try {
        console.log(req.query);
        const { limit = 10, page = 1, stock, sort = 'asc' } = req.query;
        const stockValue = stock === 0 ? undefined : parseInt(stock);
        if (!['asc', 'desc'].includes(sort)) {
            return res.render('home', { error: 'El parámetro sort debe ser asc o desc' });
        }
        const sortValue = sort === 'asc' ? 1 : -1;
        let query = {};
        if (stockValue) {
            query = { stock: { $gte: stockValue } };
        }

        const result = await productService.getWithPaginate(query,
            {
                page,
                limit,
                sort: { price: sortValue },
                lean: true
            });
        const baseUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`
        const resultProductsView = {
            status: "success",
            payload: result.docs,
            totalPages: result.totalPages,
            page: result.page,
            prevPage: result.prevPage,
            hasPrevPage: result.hasPrevPage,
            prevLink: result.hasPrevPage ? baseUrl.replace(`page=${result.page}`, `page=${result.prevPage}`) : null,
            nextPage: result.nextPage,
            hasNextPage: result.hasNextPage,
            nextLink: result.hasNextPage ? baseUrl.includes("page") ? baseUrl.replace(`page=${result.page}`, `page=${result.nextPage}`) : baseUrl.includes("?") ? baseUrl.concat(`&page=${result.nextPage}`) : baseUrl.concat(`?page=${result.nextPage}`) : null,
            user: req.session.userInfo
        }
        //const userCartId = req.session.cartId;
        res.render('home', resultProductsView);
    } catch (error) {
        res.render('home', { error: 'No es posible visualizar los productos' });
    }
});


// Creamos una ruta GET para '/realtimeproducts'
router.get('/realtimeproducts', async (req, res) => {
    try {
        // Obtenemos todos los productos
        const products = await productManager.getProducts();
        // Renderizamos la vista 'realTimeProducts', pasando los productos y el archivo de estilo
        res.render('realTimeProducts', { products, style: 'realtimeproducts.css' });
    } catch (error) {
        // Si hay un error, lo devolvemos en la respuesta
        res.send({ error: error.message });
    }
});

// Creamos una ruta GET para '/chat'
router.get("/chat", (req, res) => {
    res.render("chat");
});


router.get('/cart/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        console.log('cartId:', cartId);
        const cart = await cartService.getById(cartId);
        console.log('cart:', cart);
        const detailedProducts = [];
        for (let product of cart.products) {
            const productDetails = await productService.getProductById(product._id);
            detailedProducts.push({
                ...productDetails._doc, // _doc te da el objeto subyacente del documento Mongoose
                quantity: product.quantity
            });
        }

        // Crear un objeto de carrito con detalles completos de los productos
        const detailedCart = {
            _id: cart._id,
            products: detailedProducts,
            __v: cart.__v
        };

        const plainCart = JSON.parse(JSON.stringify(detailedCart));
        res.render('cart', { cart: plainCart });
    } catch (error) {
        console.error('Error al obtener el carrito', error);
    }
});

