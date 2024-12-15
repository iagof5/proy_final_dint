document.addEventListener('DOMContentLoaded', () => {
    fetch('./js/productos.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(productos => {
            mostrarProductos(productos, "todos"); 

            document.getElementById('todos').addEventListener('click', () => {
                mostrarProductos(productos, "todos");
            });

            document.getElementById('moviles').addEventListener('click', () => {
                mostrarProductos(productos, "moviles");
            });

            document.getElementById('portatiles').addEventListener('click', () => {
                mostrarProductos(productos, "portatiles");
            });

            document.getElementById('televisiones').addEventListener('click', () => {
                mostrarProductos(productos, "televisiones");
            });

            actualizarCarrito(); 

            document.querySelectorAll('.logo').forEach(logo => {
                logo.addEventListener('click', () => {
                    sessionStorage.clear(); 
                    actualizarCarrito();
                    window.location.href = 'index.html';
                });
            });
        })
        .catch(error => mostrarError(error.message));
});

function mostrarProductos(productos, categoria) {
    const contenedorProductos = document.getElementById('contenedor-productos');
    contenedorProductos.innerHTML = ""; 

    productos.forEach(producto => {
        if (categoria === "todos" || producto.categoria.id === categoria) {
            const productoDiv = document.createElement('div');
            productoDiv.classList.add('producto');

            productoDiv.innerHTML = `
                <img class="producto-imagen" src="${producto.imagen}" alt="Imagen producto">
                <div class="producto-detalles">
                    <h3 class="producto-titulo">${producto.titulo}</h3>
                    <p class="producto-precio">$${producto.precio}</p>
                    <button class="producto-agregar" data-id="${producto.id}">Agregar</button>
                </div>
            `;

            contenedorProductos.appendChild(productoDiv);
        }
    });


    const botonesAgregar = document.querySelectorAll('.producto-agregar');
    botonesAgregar.forEach(boton => {
        boton.addEventListener('click', agregarAlCarrito);
    });
}

function agregarAlCarrito(event) {
    const idProducto = event.target.getAttribute('data-id');
    let carrito = JSON.parse(sessionStorage.getItem('carrito')) || {};

    if (carrito[idProducto]) {
        carrito[idProducto]++;
    } else {
        carrito[idProducto] = 1;
    }

    sessionStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarCarrito();
}

function actualizarCarrito() {
    const numerito = document.getElementById('numerito');
    let carrito = JSON.parse(sessionStorage.getItem('carrito')) || {};
    let totalProductos = Object.values(carrito).reduce((acc, cantidad) => acc + cantidad, 0);
    numerito.textContent = totalProductos;
}

function mostrarError(mensaje) {
    const errorMessage = document.getElementById('error-message');
    if (!errorMessage) {
        console.error('No se encontró el contenedor de mensajes de error en el DOM.');
    } else {
        errorMessage.textContent = mensaje;
    }
}
