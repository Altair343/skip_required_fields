import { patch } from "@web/core/utils/patch";
import { FormController } from "@web/views/form/form_controller";
import { Record } from "@web/model/relational_model/record";

let lastSkipContext = null;

function extractSkipContext(clickParams) {
    let ctx = null;
    try {
        if (clickParams.buttonContext?.skip_is_valid) {
            ctx = clickParams.buttonContext;
        } else if (clickParams.context) {
            const raw = clickParams.context;
            if (typeof raw === "string" && raw.includes("skip_is_valid")) {
                ctx = JSON.parse(raw.replaceAll("'", '"'));
            } else if (raw && typeof raw === "object" && raw.skip_is_valid) {
                ctx = raw;
            }
        }
    } catch (error) {
        console.warn("The button context could not be interpreted:", ctx);
        console.warn("Error:", error);
    }
    if (ctx && Array.isArray(ctx.skip_is_valid)) {
        return ctx;
    }
    return null;
}

patch(FormController.prototype, {
    async beforeExecuteActionButton(clickParams) {
        lastSkipContext = extractSkipContext(clickParams);
        return super.beforeExecuteActionButton(...arguments);
    },

    async afterExecuteActionButton(clickParams) {
        lastSkipContext = null;
        return super.afterExecuteActionButton(...arguments);
    },
});


patch(Record.prototype, {
    _checkValidity({ silent, displayNotification, removeInvalidOnly } = {}) {
        try{
            const result = super._checkValidity({ silent, displayNotification: false, removeInvalidOnly });
            if (!lastSkipContext) {
                if (!result && displayNotification) {
                    this._closeInvalidFieldsNotification = this._displayInvalidFieldNotification();
                }
                return result;
            }
            const skipList = lastSkipContext.skip_is_valid || [];
            if (skipList.includes("all")) {
                this._invalidFields.clear();
                this._unsetRequiredFields.clear();
                return true;
            }
            for (const fieldName of skipList) {
                this._invalidFields.delete(fieldName);
                this._unsetRequiredFields.delete(fieldName);
            }
            const isValid = !this._invalidFields.size;
            if (!isValid && displayNotification) {
                this._closeInvalidFieldsNotification = this._displayInvalidFieldNotification();
            }
            return isValid;
        } catch (error) {
            console.warn("Error:", error);
            return super._checkValidity({ silent, displayNotification, removeInvalidOnly });
        }
    },
});