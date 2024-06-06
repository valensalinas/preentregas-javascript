let productos = [
    {
        id: 'artcid-00001',
        name: 'Remera High Runner',
        price: 15000,
        img: './assets/img/remera_handball.jpg',
        description: 'Remera de entrenamiento.',
    },
    {
        id: 'artcid-00002',
        name: 'Remera Hummel',
        price: 17000,
        img: './assets/img/remera_handball.jpg',
        description: 'Remera de entrenamiento.',
    },
    {
        id: 'artcid-00003',
        name: 'Medias Hummel',
        price: 6000,
        img: './assets/img/remera_handball.jpg',
        description: 'Medias Pack x3 Blancas',
    },
    {
        id: 'artcid-00004',
        name: 'Camperón CIDECO High Runner',
        price: 50000,
        img: './assets/img/remera_handball.jpg',
        description: 'Camperón de abrigo con los colores de CIDECO.',
    },
    {
        id: 'artcid-00005',
        name: 'Pantalón CIDECO High Runner',
        price: 30000,
        img: './assets/img/remera_handball.jpg',
        description: 'Pantalón de conjunto azul oscuro.',
    },
    {
        id: 'artcid-00006',
        name: 'Campera CIDECO High Runner',
        price: 25000,
        img: './assets/img/remera_handball.jpg',
        description: 'Campera de conjunto roja.',
    },
    {
        id: 'artcid-00007',
        name: 'Short High Runner de Juego',
        price: 16000,
        img: './assets/img/remera_handball.jpg',
        description: 'Short de juego largo negro para caballeros, con escudo de High Runner.',
    },
    {
        id: 'artcid-00008',
        name: 'Short High Runner de Juego',
        price: 16000,
        img: './assets/img/remera_handball.jpg',
        description: 'Short de juego negro corto para damas, con escudo de High Runner.',
    },
    {
        id: 'artcid-00009',
        name: 'Media de compresión Hummel',
        price: 8000,
        img: './assets/img/remera_handball.jpg',
        description: 'Media de compresión x2 de color negro.',
    },
    {
        id: 'artcid-00010',
        name: 'Media de compresión Hummel',
        price: 8000,
        img: './assets/img/remera_handball.jpg',
        description: 'Media de compresión x2 de color blanco.',
    },
];

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

function mostrarProductos() {
    const productosDiv = document.getElementById('productos');
    productosDiv.innerHTML = '';

    productos.forEach(producto => {
        const productoDiv = document.createElement('div');
        productoDiv.className = 'producto';
        productoDiv.innerHTML = `
            <img src="${producto.img}" alt="${producto.name}" width="200" height="300">
            <h3>${producto.name}</h3>
            <p>${producto.description}</p>
            <p>Precio: $${producto.price}</p>
            <button class="agregar-al-carrito" data-id="${producto.id}">Agregar al carrito</button>
        `;
        productosDiv.appendChild(productoDiv);
    });

    const buttons = document.querySelectorAll('.agregar-al-carrito');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const productoId = button.getAttribute('data-id');
            agregarAlCarrito(productoId);
        });
    });
}

function agregarAlCarrito(productoId) {
    const producto = productos.find(p => p.id === productoId);
    const carritoItem = carrito.find(item => item.id === productoId);

    if (carritoItem) {
        carritoItem.quantity += 1;
    } else {
        carrito.push({ ...producto, quantity: 1 });
    }

    guardarCarrito();
    mostrarCarrito();
}

function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    const total = carrito.reduce((sum, item) => sum + item.price * item.quantity, 0);
    sessionStorage.setItem('total', total);
}

function mostrarCarrito() {
    const carritoDiv = document.getElementById('carrito');
    carritoDiv.innerHTML = '';

    if (carrito.length === 0) {
        carritoDiv.innerHTML = '<p>Tu carrito está vacío.</p>';
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
                <td>${item.name}</td>
                <td>$${item.price}</td>
                <td>${item.quantity}</td>
                <td>$${item.price * item.quantity}</td>
                <td><button class="eliminar-del-carrito" data-index="${index}">Eliminar</button></td>
            </tr>
        `).join('')}
        </tbody>
    `;
    carritoDiv.appendChild(table);

    const total = carrito.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalDiv = document.createElement('div');
    totalDiv.className = 'total';
    totalDiv.innerHTML = `<p>Total: $${total}</p>`;
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

mostrarProductos();
mostrarCarrito();
