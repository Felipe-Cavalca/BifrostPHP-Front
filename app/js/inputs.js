/**
 * @requires app/core/core.js
 */
class Input {

    selector = "";

    static InputModeEnum = {
        NONE: "none", // Default
        TEXT: "text", // Default for text inputs
        DECIMAL: "decimal", // Numeric input with decimal point
        NUMERIC: "numeric", // Numeric input
        TEL: "tel", // Telephone input
        SEARCH: "search", // Search input
        EMAIL: "email", // Email input
        URL: "url", // URL input
        PASSWORD: "password", // Password input
        LATIN_NAME: "latin-name" // Names with Latin characters
    }

    static InputAutocapitalizeEnum = {
        OFF: "off",
        NONE: "none",
        SENTENCES: "sentences",
        WORDS: "words",
        CHARACTERS: "characters"
    }

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
     * Retorna o placeholder do input
     * @returns {string} Placeholder do input
     */
    get placeholder() {
        return DOM.getAttribute(this.element, "placeholder");
    }

    /**
     * Altera o placeholder do input
     * @param {string} value Novo placeholder do input
     */
    set placeholder(value) {
        DOM.addAttributes(this.element, { placeholder: value });
    }

    /**
     * Retorna se o input é obrigatório
     * @returns {boolean|array} true se for obrigatório, false caso contrário
     */
    get required() {
        let requireds = DOM.getAttribute(this.element, "required");
        if (Array.isArray(requireds)) {
            return requireds.map(item => item !== null);
        }
        return requireds !== null;
    }

    /**
     * Define se o input é obrigatório
     * @param {boolean} value true para obrigatório, false caso contrário
     */
    set required(value) {
        if (value) {
            DOM.addAttributes(this.element, { required: true });
        } else {
            DOM.removeAttribute(this.element, "required");
        }
    }

    /**
     * Retorna o tamanho mínimo do input
     * @returns {number} Tamanho mínimo do input
     */
    get minLength() {
        let lengths = DOM.getAttribute(this.element, "minlength");
        if (Array.isArray(lengths)) {
            return lengths.map(item => parseInt(item) || 0);
        }
        return lengths ? parseInt(lengths) : 0;
    }

    /**
     * Altera o tamanho mínimo do input
     * @param {number} value Novo tamanho mínimo do input
     */
    set minLength(value) {
        DOM.addAttributes(this.element, { minlength: value });
    }

    /**
     * Retorna o tamanho máximo do input
     * @returns {number} Tamanho máximo do input
     */
    get maxLength() {
        let lengths = DOM.getAttribute(this.element, "maxlength");
        if (Array.isArray(lengths)) {
            return lengths.map(item => parseInt(item) || 0);
        }
        return lengths ? parseInt(lengths) : 0;
    }

    /**
     * Altera o tamanho máximo do input
     * @param {number} value Novo tamanho máximo do input
     */
    set maxLength(value) {
        DOM.addAttributes(this.element, { maxlength: value });
    }

    /**
     * Retorna o pattern do input
     * @returns {string|array} Pattern do input
     */
    get pattern() {
        let patterns = DOM.getAttribute(this.element, "pattern");
        if (Array.isArray(patterns)) {
            return patterns.map(item => item || "");
        }
        return patterns || "";
    }

    /**
     * Altera o pattern do input
     * @param {string} value Novo pattern do input
     */
    set pattern(value) {
        DOM.addAttributes(this.element, { pattern: value });
    }

    /**
     * Retorna o inputmode do input
     * @returns {string|array} Inputmode do input
     */
    get inputMode() {
        let inputModes = DOM.getAttribute(this.element, "inputmode");
        if (Array.isArray(inputModes)) {
            return inputModes.map(item => item || "");
        }
        return inputModes || "";
    }

    /**
     * Altera o inputmode do input
     * @param {string} value Novo inputmode do input
     */
    set inputMode(value) {
        if (!Object.values(Input.InputModeEnum).includes(value)) {
            throw new Error(`Invalid inputMode: ${value}`);
        }
        DOM.addAttributes(this.element, { inputmode: value });
    }

    /**
     * Retorna o autocapitalize do input
     * @returns {string|array} Autocapitalize do input
     */
    get autocapitalize() {
        let autocapitalizeValues = DOM.getAttribute(this.element, "autocapitalize");
        if (Array.isArray(autocapitalizeValues)) {
            return autocapitalizeValues.map(item => item || "");
        }
        return autocapitalizeValues || "";
    }

    /**
     * Altera o autocapitalize do input
     * @param {string} value Novo autocapitalize do input
     */
    set autocapitalize(value) {
        DOM.addAttributes(this.element, { autocapitalize: value });
    }

    /**
     * Retorna o spellcheck do input
     * @returns {boolean|array} Spellcheck do input
     */
    get spellcheck() {
        let spellcheckValues = DOM.getAttribute(this.element, "spellcheck");
        if (Array.isArray(spellcheckValues)) {
            return spellcheckValues.map(item => item === "true");
        }
        return spellcheckValues === "true";
    }

    /**
     * Altera o spellcheck do input
     * @param {boolean} value Define se o spellcheck será habilitado ou não
     */
    set spellcheck(value) {
        DOM.addAttributes(this.element, { spellcheck: value ? "true" : "false" });
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

    /**
     * Configura inputs do tipo name com atributos recomendados sem sobreposição dos atributos já existentes
     * @param {string} seletor seletor dos inputs a serem alterados
     */
    static applyTypeName(seletor = "input[type='name']") {
        let input = new Input(seletor + ':not([minlength])');
        input.minLength = 4;
        input = new Input(seletor + ':not([pattern])');
        input.pattern = "^[a-zA-ZÀ-ÖØ-öø-ÿ]+(\\s+[a-zA-ZÀ-ÖØ-öø-ÿ]+)+$";
        input = new Input(seletor + ':not([inputmode])');
        input.inputMode = Input.InputModeEnum.LATIN_NAME;
        input = new Input(seletor + ':not([autocapitalize])');
        input.autocapitalize = Input.InputAutocapitalizeEnum.WORDS;
        input = new Input(seletor + ':not([spellcheck])');
        input.spellcheck = true;
    }

    /**
     * Configura inputs do tipo email com atributos recomendados sem sobreposição dos atributos já existentes
     * @param {string} seletor seletor dos inputs a serem alterados
     */
    static applyTypeEmail(seletor = "input[type='email']") {
        let input = new Input(seletor + ':not([inputmode])');
        input.inputMode = Input.InputModeEnum.EMAIL;
        input = new Input(seletor + ':not([autocapitalize])');
        input.autocapitalize = Input.InputAutocapitalizeEnum.OFF;
        input = new Input(seletor + ':not([spellcheck])');
        input.spellcheck = false;
    }
}

// Desabilita o autocomplete de todos os inputs que não possuírem o atributo definido
Input.setAutoComplete("input:not([autocomplete])", false);
Input.applyTypeName();
Input.applyTypeEmail();
