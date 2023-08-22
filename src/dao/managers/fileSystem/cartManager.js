import fs from 'fs';

// Clase para gestionar la funcionalidad de los carritos
class CartManager {
    // Se pasa el nombre del archivo donde se guardan los carritos al instanciar la clase
    constructor(file) {
        this.file = file;
    }

    // Función para crear un nuevo carrito
    async createCart() {
        // Se obtienen todos los carritos
        let carts = await this.getCarts();

        let newId = 1;

        // Si ya existen carritos, se obtiene el id máximo existente y se suma 1 para el nuevo carrito
        if (carts.length > 0) {
            let maxExistingId = Math.max(...carts.map(cart => cart.id));
            newId = maxExistingId + 1;
        }

        // Se crea el nuevo carrito con el id y una lista de productos vacía
        const newCart = {
            id: newId,
            products: []
        };

        // Se agrega el nuevo carrito a la lista de carritos y se guarda
        carts.push(newCart);
        await this.saveCarts(carts);

        return newId;
    }

    // Función para obtener todos los carritos
    async getCarts() {
        try {
            // Se lee el archivo y se convierte a JSON
            const carts = await fs.promises.readFile(this.file, 'utf-8');
            return JSON.parse(carts);
        } catch (error) {
            console.error('Error reading carts file', error);
            return [];
        }
    }

    // Función para obtener un carrito por id
    async getCartById(id) {
        const carts = await this.getCarts();
        const cart = carts.find(cart => cart.id === id);

        if (!cart) {
            throw new Error('Cart not found');
        }

        return cart;
    }

    // Función para guardar los carritos
    async saveCarts(carts) {
        try {
            // Se convierten los carritos a string y se guardan en el archivo
            await fs.promises.writeFile(this.file, JSON.stringify(carts, null, 2));
        } catch (error) {
            console.error('Error writing to carts file', error);
        }
    }

    // Función para agregar un producto a un carrito
    async addProductToCart(cartId, productId) {
        let carts = await this.getCarts();
        let cart = carts.find(cart => cart.id === cartId);

        if (!cart) {
            console.error('Cart not found');
            return;
        }

        // Si el producto ya existe en el carrito, se aumenta la cantidad
        let product = cart.products.find(product => product.id === productId);

        if (product) {
            product.quantity += 1;
        } else {
            // Si el producto no existe en el carrito, se agrega con cantidad 1
            cart.products.push({ id: productId, quantity: 1 });
        }

        await this.saveCarts(carts);
    }
}

export default CartManager;
