const bifrost = new Bifrost(
    (bifrost) => {
    },
    (bifrost) => {
        bifrost.replaceTextInElement("body", bifrost.config);

        bifrost.form("form", () => {
            alert().success("Form submitted successfully!");
            // return false;
        }, async (response) => {
            document.querySelector("c-alert").style.display = 'block'

            document.querySelector("#response-form").innerHTML = await response.text();
        });
    }
);
