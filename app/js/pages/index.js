const bifrost = new Bifrost(
    (bifrost) => {
    },
    (bifrost) => {
        bifrost.replaceTextInElement("body", bifrost.config);

        bifrost.form("form", () => {
            // return false;
        }, () => {

        });
    }
);
