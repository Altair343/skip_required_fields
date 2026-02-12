odoo.define('skip_required.skip_is_valid', function (require) {
    "use strict";

    let BasicController = require('web.BasicController');
    let FormController = require('web.FormController');
    let lastButtonContext = null;

    FormController.include({
        _onButtonClicked: function (event) {
            const context = event.data.attrs.context;
            lastButtonContext = null;
            if (context?.includes('skip_is_valid')) {
                try {
                    const ctxObj = JSON.parse(context.replaceAll("'", '"'));
                    this._lastButtonContext = ctxObj;
                    lastButtonContext = ctxObj;  // <=== It is saved in a shared variable
                } catch (error) {
                    console.warn("The button context could not be interpreted:", context);
                    console.warn("Error:", error);
                }
            }
            return this._super.apply(this, arguments);
        },
    });

    BasicController.include({
        /**
         * @override
         */
        canBeSaved: function (recordID) {
            try {
                if (lastButtonContext){
                    let skip_is_valid = lastButtonContext.skip_is_valid;
                    let fieldNames = this.renderer.canBeSaved(recordID || this.handle);
                    let resultado = fieldNames.filter(item => !skip_is_valid.includes(item));

                    if (!resultado.length || skip_is_valid.includes('all')) {
                        lastButtonContext = null;
                        return true;
                    }
                    else{
                        this._notifyInvalidFields(resultado);
                        lastButtonContext = null;
                        return false;
                    }
                }
            } catch (error) {
                console.warn("Error:", error);
            }

            lastButtonContext = null;
            return this._super.apply(this, arguments);
        },
    });
});