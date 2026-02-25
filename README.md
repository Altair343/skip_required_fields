# skip_required_fields
Skip required fields odoo

1. Install the module
2. Add comma-separated list of fields to the "skip_is_valid" key of context for the button in form view
3. Also, you can use the "all" keyword to skip all fields like that:  ```context="{'skip_is_valid':['all']}"```

Code example:

### xml view ###

```xml
<!-- Step 4 - code example -->
<record id="sale_view_form_inherited" model="ir.ui.view">
    <field name="name">sale.view.form.inherited</field>
    <field name="model">sale</field>
    <field name="inherit_id" ref="sale.sale_view_form"/>
    <field name="arch" type="xml">
        <data>
            <!-- If you need inherit existing button -->
            <button name="action_send" position="attributes">
                <attribute name="context">{'skip_is_valid':['all']}</attribute>
            </button>
            <!-- When you add a new button -->
            <button name="action_cancel" string="Cancel" type="object"
                    states="registered" class="oe_highlight" groups="base.group_user"
                    context="{'skip_is_valid':['extension_agreement_id','observation']}"/>
        </data>
    </field>
</record>
```

## Credits

This module is based on [xf_form_button_upgrade](https://apps.odoo.com/apps/modules/10.0/xf_form_button_upgrade) by XFanis, originally developed for Odoo 10.

This version has been adapted and updated for Odoo 19, including:
- Compatibility updates for Odoo 19
- Code improvements and bug fixes

Special thanks to the original author for the initial implementation.