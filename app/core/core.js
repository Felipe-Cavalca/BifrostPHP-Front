// Classe pra menipulação de elementos do dom
class DOM {

    get head() {
        return document.head;
    }

    get body() {
        return document.body;
    }

    set meta(valor) {
        let elem = this.createElement("meta", valor);
        this.insertBefore(elem, this.head);
    }

    set link(valor) {
        let elem = this.createElement("link", valor);
        this.insertBefore(elem, this.head);
    }

    getAttribute(elem, attr) {
        return elem.getAttribute(attr);
    }

    /**
     * Função retorna elementos do DOM
     * @param {String} selector Seletor dos elementos
     * @returns Lista de elementos
     */
    static getElement(selector) {
        return document.querySelectorAll(selector);
    }

    setHtml(elem, html) {
        elem.innerHTML = html;
    }

    insertBefore(newNode, referenceNode) {
        referenceNode.insertBefore(newNode, referenceNode.firstChild);
    }

    insertChild(newNode, parentNode) {
        parentNode.appendChild(newNode);
    }

    createElement(tagName, attributes) {
        let element = document.createElement(tagName);
        element = DOM.addAttributes(element, attributes);
        return element;
    }

    /**
     * Adiciona atributos a um elemento
     * @param {Object} elements Elemento a ter as propriedades alteradas
     * @param {Object} attributes Atributos a serem editados no formato chave valor
     * @returns Objeto alterado
     */
    static addAttributes(elements, attributes) {
        if (elements instanceof NodeList || Array.isArray(elements)) {
            elements.forEach(el => {
                for (let key in attributes) {
                    el.setAttribute(key, attributes[key]);
                }
            });
        } else {
            for (let key in attributes) {
                elements.setAttribute(key, attributes[key]);
            }
        }

        return elements;
    }

    /**
     * Retorna o valor de um atributo de um ou mais elementos
     * @param {NodeList} element Elemento(s) do qual o atributo deve ser retornado
     * @param {String} attribute Nome do atributo a ser retornado
     * @returns {NodeList|any} Valor do atributo ou uma lista com os valores dos atributos
     */
    static getAttribute(element, attribute) {
        if (element instanceof NodeList || Array.isArray(element)) {
            let attributes = [];
            element.forEach(el => {
                attributes.push(el.getAttribute(attribute));
            });

            return attributes;
        } else {
            return element.getAttribute(attribute);
        }
    }

    /**
     * Remove um atributo de um ou mais elementos
     * @param {NodeList} elements Elemento(s) do qual o atributo deve ser removido
     * @param {String} attribute Nome do atributo a ser removido
     */
    static removeAttribute(elements, attribute) {
        if (elements instanceof NodeList || Array.isArray(elements)) {
            elements.forEach(el => {
                el.removeAttribute(attribute);
            });
        } else {
            elements.removeAttribute(attribute);
        }
    }

    /**
     * Adiciona um evento a um ou mais elementos
     * @param {NodeList} elements Elementos em que o evento deve ser adicionado
     * @param {String} event Nome do evento
     * @param {callback} callback Função a ser executada ao evento
     */
    static addEvent(elements, event, callback) {
        if (elements instanceof NodeList || Array.isArray(elements)) {
            elements.forEach(element => { element.addEventListener(event, callback); });
        } else {
            elements.addEventListener(event, callback);
        }
    }

    async registerServiceWorker(sw) {
        navigator.serviceWorker.register(sw)
            .then(async registration => {
                console.log("Service Worker registrado com sucesso:", registration);
            })
            .catch(async err => {
                console.warn("Registro do Service Worker falhou:", err);
            });
    }

    existComponent(componentName) {
        let component = document.querySelector("c-" + componentName);
        return component !== null;
    }
};

// Classe principal do framework
class Bifrost {

    // Classe para manipulação de elementos do dom
    #dom = new DOM();

    #configApp = undefined;
    #includes = undefined;

    // Prompt para instalação do PWA
    deferredPrompt

    constructor(before, after) {
        this.init(before, after);
    }

    get config() {
        return this.#configApp;
    }

    get includes() {
        return this.#includes;
    }

    get cssFiles() {
        return this.includes.cssFiles;
    }

    get jsFiles() {
        return this.includes.jsFiles;
    }

    async loadConfigApp() {
        return this.#configApp = JSON.parse(await this.requestGet("/config/app.json"));
    }

    async loadIncludes() {
        return this.#includes = JSON.parse(await this.requestGet("/config/includes.json"));
    }

    async init(before, after) {
        await this.loadConfigApp();
        await this.loadIncludes();

        if (typeof before === "function") {
            before(this);
        }

        this.#includeDefaultCss();
        this.applyPWA();
        this.#includeDefaultJs();
        this.#includeMetaDataAndLink();
        this.#includeTags();

        if (typeof after === "function") {
            DOM.addEvent(window, "load", after(this));
        }
    }

    async #includeDefaultCss() {
        let $this = this;
        let head = this.#dom.head;
        let cssFiles = this.cssFiles;

        cssFiles.forEach(function (cssFile) {
            let attrs = {
                rel: "stylesheet",
                type: "text/css",
                href: $this.#getUrl(cssFile),
                media: "all"
            };
            let elem = $this.#dom.createElement("link", attrs);
            $this.#dom.insertBefore(elem, head);
        });
    }

    async #includeDefaultJs() {
        let $this = this;
        let head = this.#dom.head;
        let jsFiles = this.jsFiles;

        jsFiles.forEach(function (jsFile) {
            let attrs = {
                type: "text/javascript",
                src: $this.#getUrl(jsFile),
                defer: ""
            };
            let elem = $this.#dom.createElement("script", attrs);
            $this.#dom.insertChild(elem, head);
        });
    }

    async #includeMetaDataAndLink() {
        let $this = this;
        let metaData = this.#includes.metaData;
        let html = DOM.getElement("html");

        DOM.addAttributes(html, {
            lang: "pt-br"
        });

        metaData.meta.forEach(function (meta) {
            $this.#dom.meta = meta;
        });

        metaData.link.forEach(function (link) {
            $this.#dom.link = link;
        });
    }

    async #includeTags() {
        let $this = this;
        let head = this.#dom.head;
        let tags = this.#includes.tags;

        tags.forEach(function (tag) {
            let elem = $this.#dom.createElement(tag.tagName, tag.attributes);
            $this.#dom.insertBefore(elem, head);
        });
    }

    async applyPWA() {
        if ("serviceWorker" in navigator) {
            this.#dom.registerServiceWorker(this.#getUrl("/sw.js"));
        }
    }

    #getUrl(url) {
        return url;
    }

    getParamUrl($param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get($param);
    }

    #addParamsToUrl(url, params) {
        if (params === undefined) {
            return url;
        }

        let urlParams = new URLSearchParams(params);
        return url + "?" + urlParams.toString();
    }

    async requestGet(url, params = undefined) {
        return (await this.request({ url: url, params: params })).text();
    }

    async requestPost({ url, data, params = undefined }) {
        return (await this.request({ url: url, method: "POST", data: data, params: params })).text();
    }

    async request({ url, method = "GET", data = undefined, params = undefined, headers = undefined }) {
        const fullUrl = this.#addParamsToUrl(this.#getUrl(url), params);

        return await fetch(fullUrl, {
            method: method,
            headers: headers ?? {
                'Content-Type': 'application/json'
            },
            body: method !== 'GET' ? JSON.stringify(data) : undefined
        });
    }

    form(formSelector, beforeSubmit, afterSubmit) {
        const form = DOM.getElement(formSelector);
        DOM.addEvent(form, "submit", async (event) => {
            event.preventDefault();
            let beforeResult = true;

            if (typeof beforeSubmit === 'function') {
                beforeResult = beforeSubmit();
            }

            if (beforeResult !== false) {
                let action = form.action.replace(location.origin, "");
                if (this.#dom.getAttribute(form, "data-noApi") == null) {
                    action = "/api" + action;
                }
                const method = this.#dom.getAttribute(form, "method");
                const formData = new FormData(form);
                const formDataObject = Object.fromEntries(formData);
                const response = await this.request({ url: action, data: formDataObject, method: method });

                if (typeof afterSubmit === 'function') {
                    afterSubmit(response);
                }
            }
        });
    }

    createOptionsInSelect(elem, options) {
        options.forEach(attrOption => {
            let option = this.#dom.createElement("option", attrOption);
            option.textContent = attrOption.textContent;
            this.#dom.insertChild(option, elem);
        });
    }

    replaceTextInElement(elemSelector, replacements) {
        let element = DOM.getElement(elemSelector);
        element.forEach(elem => {
            let html = elem.innerHTML;
            Object.keys(replacements).forEach((key) => {
                html = html.replace(
                    new RegExp(`{{${key}}}`, "g"),
                    replacements[key]
                );
            });
            this.#dom.setHtml(elem, html);
        });
        return true;
    }
}
