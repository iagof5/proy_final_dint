document.addEventListener('DOMContentLoaded', () => {
    const carrito = JSON.parse(sessionStorage.getItem('carrito')) || {};

    if (Object.keys(carrito).length === 0) {
        mostrarMensajeVacio();
    } else {
        fetch('./js/productos.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(productos => {
                const productosCarrito = productos.filter(producto => carrito[producto.id]);
                mostrarCarrito(productosCarrito, carrito);
                ocultarMensajeVacio();
            })
            .catch(error => mostrarError(error.message));
    }

    actualizarCarrito();

    agregarBotonesAcciones();

    document.querySelectorAll('.logo').forEach(logo => {
        logo.addEventListener('click', () => {
            sessionStorage.clear();
            actualizarCarrito();
            window.location.href = 'index.html';
        });
    });
});

function mostrarCarrito(productos, carrito) {
    const contenedorCarrito = document.getElementById('carrito-productos');
    contenedorCarrito.innerHTML = "";

    productos.forEach(producto => {
        const cantidad = carrito[producto.id];
        const productoDiv = document.createElement('div');
        productoDiv.classList.add('carrito-producto');

        productoDiv.innerHTML = `
            <img class="carrito-producto-imagen" src="${producto.imagen}" alt="Imagen producto">
            <div class="carrito-producto-titulo">
                <small>Título</small>
                <h3>${producto.titulo}</h3>
            </div>
            <div class="carrito-producto-cantidad">
                <small>Cantidad</small>
                <p>${cantidad}</p>
            </div>
            <div class="carrito-producto-precio">
                <small>Precio</small>
                <p>$${producto.precio}</p>
            </div>
            <div class="carrito-producto-subtotal">
                <small>Subtotal</small>
                <p>$${producto.precio * cantidad}</p>
            </div>
            <button class="carrito-producto-eliminar" data-id="${producto.id}"><i class="bi bi-trash-fill"></i></button>
        `;

        contenedorCarrito.appendChild(productoDiv);
    });

    actualizarTotalCarrito(productos, carrito);

    const botonesEliminar = document.querySelectorAll('.carrito-producto-eliminar');
    botonesEliminar.forEach(boton => {
        boton.addEventListener('click', eliminarDelCarrito);
    });
}

function actualizarTotalCarrito(productos, carrito) {
    const total = productos.reduce((acc, producto) => acc + producto.precio * carrito[producto.id], 0);
    const totalElem = document.getElementById('Total');

    if (totalElem) {
        totalElem.textContent = `$${total}`;
    }
}

function actualizarCarrito() {
    const numerito = document.getElementById('numerito');
    let carrito = JSON.parse(sessionStorage.getItem('carrito')) || {};
    let totalProductos = Object.values(carrito).reduce((acc, cantidad) => acc + cantidad, 0);

    if (numerito) {
        numerito.textContent = totalProductos;
    }
}

function eliminarDelCarrito(event) {
    const idProducto = event.target.closest('button').getAttribute('data-id');
    let carrito = JSON.parse(sessionStorage.getItem('carrito')) || {};

    if (carrito[idProducto]) {
        if (carrito[idProducto] > 1) {
            carrito[idProducto]--;
        } else {
            delete carrito[idProducto];
        }

        sessionStorage.setItem('carrito', JSON.stringify(carrito));
        actualizarCarrito();
        event.target.closest('.carrito-producto').remove();
    }

    const productos = document.querySelectorAll('.carrito-producto');
    if (productos.length === 0) {
        mostrarMensajeVacio();
    }

    const totalElem = document.getElementById('Total');
    const total = Array.from(productos).reduce((acc, producto) => {
        const subtotal = parseFloat(producto.querySelector('.carrito-producto-subtotal p').textContent.replace('$', ''));
        return acc + subtotal;
    }, 0);

    if (totalElem) {
        totalElem.textContent = `$${total}`;
    }
}

function vaciarCarrito() {
    sessionStorage.clear();
    actualizarCarrito();
    const contenedorCarrito = document.getElementById('carrito-productos');
    contenedorCarrito.innerHTML = ""; 
    const totalElem = document.getElementById('Total');
    if (totalElem) {
        totalElem.textContent = "$0"; 
    }
    mostrarMensajeVacio();
}

function comprarAhora() {
    alert('Gracias por tu compra.');
    vaciarCarrito();
}

function agregarBotonesAcciones() {
    const accionesHTML = `
        <div id="carrito-acciones" class="carrito-acciones">
            <div class="carrito-acciones-izquierda">
                <button class="carrito-acciones-vaciar">Vaciar carrito</button>
            </div>
            <div class="carrito-acciones-derecha">
                <div class="carrito-acciones-total">
                    <p>Total:</p>
                    <p id="Total">$0</p>
                </div>
                <button class="carrito-acciones-comprar">Comprar ahora</button>
            </div>
        </div>
    `;

    const contenedorCarrito = document.getElementById('carrito-productos');
    contenedorCarrito.insertAdjacentHTML('afterend', accionesHTML);

    document.querySelector('.carrito-acciones-vaciar').addEventListener('click', vaciarCarrito);
    document.querySelector('.carrito-acciones-comprar').addEventListener('click', comprarAhora);
}

function mostrarMensajeVacio() {
    document.getElementById('carrito-vacio').style.display = 'block';
    document.getElementById('carrito-productos').style.display = 'none';
}

function ocultarMensajeVacio() {
    document.getElementById('carrito-vacio').style.display = 'none';
    document.getElementById('carrito-productos').style.display = 'block';
}

function mostrarError(mensaje) {
    const errorMessage = document.getElementById('error-message');
    if (!errorMessage) {
        console.error(mensaje);
    } else {
        errorMessage.textContent = mensaje;
    }
}
