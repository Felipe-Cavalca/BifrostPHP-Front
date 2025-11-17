/**
 * @requires app/core/core.js
 */
class Input {

    selector = "";

    /**
     * Cria um objeto Js para manipulação de inputs
     * @param {String} selector Selector html para os inputs
     */
    constructor(selector) {
        this.selector = selector;
    }

    /**
     * Seleciona os elementos do DOM conforme o seletor informado
     * @returns {NodeList|Object} com os elementos selecionados ou o elemento único
     */
    get element() {
        let elements = DOM.getElement(this.selector);
        if (elements.length == 1) {
            return elements[0];
        }
        return elements;
    }

    /**
     * Altera o autocomplete de inputs
     * @param {boolean} value Define se o autocomplete será habilitado ou não
     */
    set autocomplete(value) {
        DOM.addAttributes(this.element, {
            autocomplete: value ? "on" : "off",
        });
    }

    /**
     * Altera o autocomplete de inputs
     * @param {string} selector Seletor dos inputs a serem alterados
     * @param {boolean} value Define se o autocomplete será habilitado ou não
     */
    static setAutoComplete(selector = "input", value = false) {
        let input = new Input(selector);
        input.autocomplete = value;
    }

}

// Desabilita o autocomplete de todos os inputs que não possuírem o atributo definido
Input.setAutoComplete("input:not([autocomplete])", false);
