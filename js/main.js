let productos = [];

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

const apiML = async (limit = 10) => {
    const response = await fetch(`https://api.mercadolibre.com/sites/MLA/search?q=Handball&limit=${limit}`);
    const datos = await response.json();
    productos = datos.results;
    const productosDiv = document.getElementById('productos');
    productosDiv.innerHTML = '';

    productos.forEach(item => {
        const productoDiv = document.createElement('div');
        productoDiv.className = 'producto';
        productoDiv.innerHTML = `
            <img src="${item.thumbnail}" alt="${item.title}" width="200" height="300">
            <h3>${item.title}</h3>
            <p class="stock">Stock: ${item.available_quantity}</p>
            <p class="precio">Precio: $${item.price}</p>
            <button class="comprar" data-url="${item.permalink}">Comprar</button>
            <button class="agregar-al-carrito" data-id="${item.id}">Agregar al carrito</button>
        `;
        productosDiv.appendChild(productoDiv);
    });

    const buttonsComprar = document.querySelectorAll('.comprar');
    buttonsComprar.forEach(button => {
        button.addEventListener('click', () => {
            const linkML = button.getAttribute('data-url');
            window.open(linkML, `_blank`);
        });
    });

    const buttons = document.querySelectorAll('.agregar-al-carrito');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const productoId = button.getAttribute('data-id');
            agregarAlCarrito(productoId);
        });
    });
};

apiML(15);

const agregarAlCarrito = (productoId) => {
    const producto = productos.find(p => p.id === productoId);

    if (!producto) {
        console.error('Producto no encontrado:', productoId);
        return;
    }

    const carritoItem = carrito.find(item => item.id === productoId);

    if (carritoItem) {
        carritoItem.quantity += 1;
    } else {
        carrito.push({ ...producto, quantity: 1 });
    }

    guardarCarrito();
    mostrarCarrito();
};

function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    const total = carrito.reduce((sum, item) => sum + item.price * item.quantity, 0);
    sessionStorage.setItem('total', total);
}

function mostrarCarrito() {
    const carritoDiv = document.getElementById('carrito');
    carritoDiv.innerHTML = '';

    if (carrito.length === 0) {
        carritoDiv.innerHTML = '<p class="carritoVacio">Tu carrito está vacío.</p>';
        return;
    }

    const table = document.createElement('table');
    table.className = 'carrito-table';
    table.innerHTML = `
        <thead>
            <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Total</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
        ${carrito.map((item, index) => `
            <tr>
                <td>${item.title}</td>
                <td>$${item.price.toFixed(0)}</td>
                <td>${item.quantity}</td>
                <td>$${(item.price * item.quantity).toFixed(0)}</td>
                <td><button class="eliminar-del-carrito" data-index="${index}">Eliminar</button></td>
            </tr>
        `).join('')}
        </tbody>
    `;
    carritoDiv.appendChild(table);

    const total = carrito.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalDiv = document.createElement('div');
    totalDiv.className = 'total';
    totalDiv.innerHTML = `<p>Total: $${total.toFixed(0)}</p>`;
    carritoDiv.appendChild(totalDiv);

    const finalizarCompraButton = document.createElement('button');
    finalizarCompraButton.className = 'boton-finalizar-compra';
    finalizarCompraButton.textContent = 'Finalizar compra';
    finalizarCompraButton.addEventListener('click', finalizarCompra);
    carritoDiv.appendChild(finalizarCompraButton);

    const deleteButtons = document.querySelectorAll('.eliminar-del-carrito');
    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const index = button.getAttribute('data-index');
            eliminarDelCarrito(index);
        });
    });
}

function finalizarCompra() {
    Swal.fire({
        title: "Primer paso completado!",
        text: "Serás redirigido para finalizar la transacción.",
        icon: "success",
        timer: 3500,
        timerProgressBar: true,
    });
}

function eliminarDelCarrito(index) {
    const carritoItem = carrito[index];
    if (carritoItem.quantity > 1) {
        carritoItem.quantity -= 1;
    } else {
        carrito.splice(index, 1);
    }
    guardarCarrito();
    mostrarCarrito();
}

document.addEventListener('DOMContentLoaded', () => {
    mostrarCarrito();
});
