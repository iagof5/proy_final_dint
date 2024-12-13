document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formulario');
    const nombre = document.getElementById('nombre');
    const password = document.getElementById('password');
    const errorNombre = document.getElementById('error-nombre');
    const errorPassword = document.getElementById('error-password');
    const btnLimpiar = document.getElementById('limpiar');

    
    const nombrePattern = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]{1,20}$/;
   
    const passwordPattern = /^[A-Za-z0-9·$%&/()]{8,16}$/;

    formulario.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;

     
        if (nombre.value.trim() === '') {
            errorNombre.textContent = 'Nombre obligatorio.';
            valid = false;
        } else if (!nombrePattern.test(nombre.value.trim())) {
            errorNombre.textContent = 'Nombre inválido.';
            valid = false;
        } else if (nombre.value.trim().length > 20) {
            errorNombre.textContent = 'El nombre no puede tener más de 20 caracteres.';
            valid = false;
        } else {
            errorNombre.textContent = '';
        }


        if (password.value.trim() === '') {
            errorPassword.textContent = 'La contraseña es obligatoria.';
            valid = false;
        } else if (!passwordPattern.test(password.value.trim())) {
            errorPassword.textContent = 'La contraseña debe tener entre 8 y 16 caracteres y solo puede contener letras, números y los caracteres ·$%&/().';
            valid = false;
        } else {
            errorPassword.textContent = '';
        }

        if (valid) {
            window.location.href = 'main.html';
        }
    });

    btnLimpiar.addEventListener('click', () => {
        nombre.value = '';
        password.value = '';
        errorNombre.textContent = '';
        errorPassword.textContent = '';
    });
});
