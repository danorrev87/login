import fs from 'fs';
import { v4 as uuid4 } from 'uuid';


export class ProductManager {
    constructor(path) {
        this.path = path;
        this.init();  // Inicializa la clase
    }

    async init() {
        await this.loadProductsFromFile();  // Carga productos desde el archivo al iniciar
    }

    async loadProductsFromFile() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8'); // Leer archivo
            this.products = JSON.parse(data);  // Parsea la información del archivo a un objeto JSON y lo guarda en this.products
        } catch (error) {
            this.products = [];  // En caso de error (archivo no encontrado o vacío), inicializa this.products como un array vacío
            await fs.promises.writeFile(this.path, '[]');  // Crea el archivo con un array vacío
        }
    }

    async addProduct(title, description, price, code, stock, category, thumbnails = "", status = true) {

        let newId = uuid4(); //Generación de un Id aleatorio utilizando la librería "uuid"


        // CÓDIGO ANTERIOR
        // let newId;  // ID para el nuevo producto
        // if (!this.products.length) {
        //     newId = 1;
        // } else {
        //     newId = this.products[this.products.length - 1].id + 1; // Si ya existen productos, el ID es el del último producto + 1
        // }

        const newProduct = {  // Objeto del nuevo producto
            id: newId,
            title: title.trim(),
            description: description.trim(),
            price: price,
            code: code.trim(),
            stock: stock,
            category: category.trim(),
            thumbnails: thumbnails ? thumbnails.trim() : "",
            status: status
        };

        // Validación de las propiedades requeridas del producto
        if (!title || !description || !price || !code || !stock || !category) {
            console.log('None of the mandatory properties can be empty');
            return;
        }

        // Verifica que no exista un producto con el mismo código
        if (!this.products.some((elmnt) => {
            return elmnt.code == newProduct.code;
        })) {
            this.products.push(newProduct);  // Agrega el producto a la lista
            await this.saveProductsInFile();  // Guarda la lista actualizada en el archivo
            return true;
        } else {
            console.log('Repeated code, try again');
            return false;
        }

    }

    async getProducts() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');  // Lee los datos del archivo
            const array = JSON.parse(data);  // Convierte los datos a JSON
            return array;
        } catch (error) {
            return this.products;  // En caso de error, devuelve los productos en memoria
        }
    }

    async getProductById(id) {
        const array = await this.getProducts();  // Obtiene la lista de productos
        this.products = array;
        const result = this.products.find((elmnt) => elmnt.id === id);  // Busca el producto por id

        // Si el producto existe, lo devuelve. Si no, muestra un mensaje de error
        if (result) {
            return result;
        } else {
            console.log('Not found');
        }
    }

    async saveProductsInFile() {
        const data = JSON.stringify(this.products);  // Convierte la lista de productos a formato JSON
        await fs.promises.writeFile(this.path, data);  // Guarda la lista en el archivo
    }

    async updateProduct(id, productUpdates) {
        const product = await this.getProductById(id);  // Obtiene el producto a actualizar

        // Si el producto no existe, muestra un mensaje de error
        if (!product) {
            console.log('Not found');
            return;
        }

        // Actualiza las propiedades del producto
        Object.keys(productUpdates).forEach((key) => {
            product[key] = productUpdates[key];
        })

        // Guarda la lista actualizada de productos en el archivo
        try {
            this.saveProductsInFile();
        } catch (error) {
            console.log('Could not update file');
        }

    }

    async deleteProduct(id) {
        try {
            this.products = await this.getProducts();  // Obtiene la lista de productos
            const index = this.products.findIndex((prod) => prod.id === id);  // Encuentra el índice del producto a eliminar

            // Si el producto no existe, muestra un mensaje de error
            if (index === -1) {
                console.log("Product not found")
                return
            }
            this.products.splice(index, 1);  // Elimina el producto de la lista
            this.saveProductsInFile();  // Guarda la lista actualizada en el archivo
            console.log('Product has been deleted')
        } catch (error) {
            console.log('Error deleting product');
        }

    }
};












