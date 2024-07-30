let productos = [];
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
const productosDiv = document.getElementById('productos');

// Fetch y carga de productos desde el archivo JSON
fetch("./js/productos.json")
    .then(response => response.json())
    .then(data => {
        productos = data; // Asignar los datos obtenidos al array 'productos'
        cargarProductos(productos); // Cargar los productos iniciales
    });

function cargarProductos(productosElegidos) {
    productosDiv.innerHTML = ""; // Limpiar el contenedor de productos

    productosElegidos.forEach(item => {
        const productoDiv = document.createElement('div');
        productoDiv.className = 'producto';
        productoDiv.innerHTML = `
            <img src="${item.img}" alt="${item.title}" width="200" height="300">
            <h3>${item.title}</h3>
            <p class="stock">Stock: ${item.available_quantity}</p>
            <p class="precio">Precio: $${item.price}</p>
            <button class="comprar" data-url="${item.permalink}">Comprar</button>
            <button class="agregar-al-carrito" data-id="${item.id}">Agregar al carrito</button>
        `;
        productosDiv.appendChild(productoDiv);
    });

    // Añadir el evento click para los botones "Agregar al carrito"
    const botonesAgregar = document.querySelectorAll('.agregar-al-carrito');
    botonesAgregar.forEach(boton => {
        boton.addEventListener('click', () => {
            const productoId = boton.getAttribute('data-id');
            agregarAlCarrito(productoId);
        });
    });
}

const botonesCategorias = document.querySelectorAll(".boton-categoria");

botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {
        botonesCategorias.forEach(boton => boton.classList.remove("active"));
        e.currentTarget.classList.add("active");

        const categoria = e.currentTarget.getAttribute("data-categoria");
        let productosFiltrados;
        
        if (categoria === 'todos') {
            productosFiltrados = productos;
        } else {
            productosFiltrados = productos.filter(producto => producto.categoria === categoria);
        }
        
        cargarProductos(productosFiltrados);
    });
});

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
    actualizarTotalCantidad();
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

    const table = document.createElement('div');
    table.className = 'carrito-table';
    table.innerHTML = `
        ${carrito.map((item, index) => `
            <div class="carrito-producto">
                <img class="carrito-producto-imagen" src="${item.img}" alt="${item.title}">
                <div class="carrito-producto-titulo">
                    <small>Titulo</small>
                    <h3>${item.title}</h3>
                </div>
                <div class="carrito-producto-cantidad">
                    <small>Cantidad</small>
                    <div class="botones-cantidad">
                        <button class="disminuir-cantidad" data-index="${index}">-</button>
                        <p>${item.quantity}</p>
                        <button class="aumentar-cantidad" data-index="${index}">+</button>
                    </div>
                </div>
                <div class="carrito-producto-precio">
                    <small>Precio</small>
                    <p>$${item.price.toFixed(0)}</p>
                </div>
                <div class="carrito-producto-subtotal">
                    <small>Subtotal</small>
                    <p>$${(item.price * item.quantity).toFixed(0)}</p>
                </div>
                <button class="carrito-producto-eliminar" data-index="${index}"><img src="../assets/img/basura.png" alt="tacho de basura"></button>
            </div>
        `).join('')}
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

    const vaciarCarritoButton = document.createElement('button');
    vaciarCarritoButton.className = 'boton-vaciar-carrito';
    vaciarCarritoButton.textContent = 'Vaciar carrito';
    vaciarCarritoButton.addEventListener('click', vaciarCarrito);
    carritoDiv.appendChild(vaciarCarritoButton);

    const eliminarButtons = document.querySelectorAll('.carrito-producto-eliminar');
    eliminarButtons.forEach(button => {
        button.addEventListener('click', () => {
            const index = button.getAttribute('data-index');
            eliminarDelCarrito(index);
        });
    });

    const aumentarButtons = document.querySelectorAll('.aumentar-cantidad');
    aumentarButtons.forEach(button => {
        button.addEventListener('click', () => {
            const index = button.getAttribute('data-index');
            cambiarCantidad(index, 1);
        });
    });

    const disminuirButtons = document.querySelectorAll('.disminuir-cantidad');
    disminuirButtons.forEach(button => {
        button.addEventListener('click', () => {
            const index = button.getAttribute('data-index');
            cambiarCantidad(index, -1);
        });
    });
    
    actualizarTotalCantidad();
}

function vaciarCarrito() {
    carrito = [];
    guardarCarrito();
    mostrarCarrito();
    actualizarTotalCantidad();
}

function finalizarCompra() {
    Swal.fire({
        title: "¡Primer paso completado!",
        text: "Serás redirigido para finalizar la transacción.",
        icon: "success",
        timer: 3500,
        timerProgressBar: true,
    });
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    guardarCarrito();
    mostrarCarrito();
    actualizarTotalCantidad();
}

function cambiarCantidad(index, cantidad) {
    const carritoItem = carrito[index];
    carritoItem.quantity += cantidad;
    if (carritoItem.quantity <= 0) {
        eliminarDelCarrito(index);
    } else {
        guardarCarrito();
        mostrarCarrito();
        actualizarTotalCantidad();
    }
}

function actualizarTotalCantidad() {
    const totalCantidad = carrito.reduce((sum, item) => sum + item.quantity, 0);
    const totalCantidadSpan = document.querySelector('.numero-de-carrito');
    totalCantidadSpan.innerHTML = `${totalCantidad}`;
}

mostrarCarrito();

document.addEventListener('DOMContentLoaded', () => {
    actualizarTotalCantidad();
});
