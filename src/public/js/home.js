const addToCart = async (productId) => {
    let cartElement = document.getElementById('currentCartId');
    console.log('Elemento cartId encontrado:', cartElement.value);
    let cartId = cartElement ? cartElement.value : null

    // Si no hay un carrito existente, crea uno nuevo
    if (!cartId) {
        try {
            const response = await fetch('/api/carts/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (data.status === "success") {
                cartId = data.data._id;
                console.log('Nuevo carrito creado:', cartId);
                cartElement.value = cartId;
                // Guarda el ID del carrito en el almacenamiento local
                let cartUrlElement = document.getElementById('cartUrl');
                if (cartUrlElement) {
                    console.log('Elemento cartUrl encontrado.');
                    cartUrlElement.setAttribute('href', `/cart/${cartId}`);
                    cartUrlElement.style.display = 'flex';
                } else {
                    console.log('Elemento cartUrl no encontrado.');
                }
            } else {
                alert('Error al crear un nuevo carrito.');
                return;
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al crear un nuevo carrito.');
            return;
        }
    }

    // Agrega el producto al carrito existente
    fetch(`/api/carts/${cartId}/products/${productId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity: 1 })
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                alert('Producto agregado al carrito!');
            } else {
                alert('Error al agregar el producto al carrito.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al agregar el producto al carrito.');
        });
}

