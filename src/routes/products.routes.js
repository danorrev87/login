// Importamos los módulos necesarios
import express from 'express';
import { ProductManagerMongo } from '../dao/managers/mongoDB/productManagerMongo.js';
import { io } from '../app.js';


// Configuramos el administrador de productos con el método de persistencia File System
//import { ProductManager } from '../dao/managers/fileSistem/productManager.js';
//const productManager = new ProductManager('./products.json');

// Inicializamos el enrutador de Express y el administrador de productos
const router = express.Router();
const productManager = new ProductManagerMongo();

const validateFields = (req, res, next) => {
    const productInfo = req.body;
    if (!productInfo.title || !productInfo.description || !productInfo.price || !productInfo.code || !productInfo.stock || !productInfo.category) {
        return res.json({ status: 'error', message: 'Campos incompletos' });
    } else {
        next();
    }
};

// Ruta para obtener todos los productos o un número limitado de ellos
router.get('/', async (req, res) => {
    try {
        const result = await productManager.getProducts();
        const limit = parseInt(req.query.limit);
        let products;
        if (limit > 0) {
            products = result.slice(0, limit);
        } else {
            products = result;
        }
        res.json({ status: 'success', data: products });
    } catch (error) {
        res.send({ status: 'error', message: error.message });
    }
});

// Ruta para obtener un producto específico por ID
router.get('/:pid', async (req, res) => {
    try {
        const id = parseInt(req.params.pid);
        const product = await productManager.getProductById(id);

        if (!product) {
            return res.send({ error: 'Product does not exist' });
        }

        res.send(product);
    } catch (error) {
        res.send({ error: error.message });
    }
});

// Ruta para añadir un nuevo producto
router.post('/', validateFields, async (req, res) => {
    try {
        const { title, description, price, code, stock, category, thumbnails } = req.body;
        const status = (req.body.status === 'true');
        const isAdded = await productManager.addProduct({ title, description, price, code, stock, category, thumbnails, status });

        if (isAdded) {
            res.send({ status: 'success', message: 'Product added successfully' });
            const updatedProducts = await productManager.getProducts();
            io.emit('productAdded', updatedProducts);
        } else {
            res.status(400).send({ status: 'error', message: 'Failed to add product, code is repeated' });
        }
    } catch (error) {
        res.status(400).send({ status: 'error', error: 'Invalid request' });
    }
});

// Ruta para actualizar un producto específico
router.put('/:pid', async (req, res) => {
    try {

        const id = parseInt(req.params.pid);
        const productUpdates = req.body;

        await productManager.updateProduct(id, productUpdates);
        res.send({ status: 'success', message: 'Product updated successfully' })

    } catch (error) {
        res.status(400).send({ status: 'error', error: 'Invalid request' });
    }
});

// Ruta para eliminar un producto específico
router.delete('/:pid', async (req, res) => {
    try {

        const id = parseInt(req.params.pid);
        const product = await productManager.getProductById(id);
        if (!product) {
            return res.status(404).send({ error: 'Product does not exist' });
        }
        await productManager.deleteProduct(id);
        const updatedProducts = await productManager.getProducts();
        io.emit('productDeleted', { status: 'success', message: 'Product deleted successfully', updatedProducts });
        res.send({ status: 'success', message: 'Product deleted successfully' })
    } catch (error) {
        res.status(400).send({ status: 'error', error: 'Invalid request' });
    }
})

// Exportamos el enrutador para usarlo en otros módulos
export default router;
