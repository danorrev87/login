// Establecemos una conexión con el servidor a través de Socket.IO
const socket = io();

// Cuando se agrega un producto, actualizamos la lista de productos
socket.on('productAdded', (updatedProducts) => {
    // Obtenemos la lista de productos del DOM
    const productList = document.getElementById('productList');
    // Limpiamos el contenido actual de la lista
    productList.innerHTML = '';

    // Por cada producto actualizado, creamos un nuevo elemento de lista
    updatedProducts.forEach((product) => {
        const productItem = document.createElement('li');
        productItem.innerHTML = `
            <h2>${product.title}</h2>
            <p>ID: ${product.id}</p>
            <p>Descripción: ${product.description}</p>
            <p>Precio: ${product.price}</p>
            <p>Miniatura:${product.thumbnails}</p>
            <p>Código: ${product.code}</p>
            <p>Stock: ${product.stock}</p>
            <p>Estado: ${product.status}</p>
            <p>Categoría: ${product.category}</p>
          `;

        // Añadimos el elemento de la lista a la lista de productos
        productList.appendChild(productItem);
    });
});

// Cuando se elimina un producto, actualizamos la lista de productos
socket.on('productDeleted', (response) => {
    const updatedProducts = response.updatedProducts;
    productList.innerHTML = '';
    updatedProducts.forEach((product) => {
        const productItem = document.createElement('li');
        productItem.innerHTML = `
        <h2>${product.title}</h2>
        <p>ID: ${product.id}</p>
        <p>Descripción: ${product.description}</p>
        <p>Precio: ${product.price}</p>
        <p>Miniatura:${product.thumbnails}</p>
        <p>Código: ${product.code}</p>
        <p>Stock: ${product.stock}</p>
        <p>Estado: ${product.status}</p>
        <p>Categoría: ${product.category}</p>
      `;

        productList.appendChild(productItem);
    });
});

// Escuchamos el evento de envío del formulario de agregar producto
document.getElementById('addForm').addEventListener('submit', event => {
    // Prevenimos la acción por defecto del formulario
    event.preventDefault();

    // Obtenemos los valores de los campos del formulario
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;
    const code = document.getElementById('code').value;
    const stock = document.getElementById('stock').value;
    const category = document.getElementById('category').value;
    const thumbnails = document.getElementById('thumbnails').value;
    const status = document.getElementById('status').value;

    // Hacemos un request POST al servidor con los datos del formulario
    fetch(`/api/products/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, price, code, stock, category, thumbnails, status }),
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
});

// Escuchamos el evento de envío del formulario de eliminar producto
document.getElementById('deleteForm').addEventListener('submit', event => {
    // Prevenimos la acción por defecto del formulario
    event.preventDefault();

    // Obtenemos el valor del campo ID
    const id = document.getElementById('id').value;

    // Hacemos un request DELETE al servidor con el ID del producto a eliminar
    fetch(`/api/products/${id}`, {
        method: 'DELETE',
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
});
