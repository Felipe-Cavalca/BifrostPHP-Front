// Cria o notfy globalmente
var notyf;
function alert() {
    if (notyf == undefined) {
        notyf = new Notyf({
            position: {
                x: 'right',
                y: 'top',
            }
        });
    }

    return notyf;
}


// Suas funções aqui
