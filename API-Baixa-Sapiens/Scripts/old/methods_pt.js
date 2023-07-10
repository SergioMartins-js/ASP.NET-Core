/*
 * Localized default methods for the jQuery validation plugin.
 * Locale: PT_BR
 */
jQuery.extend(jQuery.validator.methods,
    {
        date: function(value, element) {
            return this.optional(element) || /^\d\d?\/\d\d?\/\d\d\d?\d?$/.test(value);
        },
        number: function(value, element) {
            return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d+)?$/.test(value);
        },
        range: function(value, element, param) {
            value = value.replace(new RegExp("[.]", "g"), "").replace(",", ".");
            return this.optional(element) || (value >= param[0] && value <= param[1]);
        },

    });


jQuery.validator.addMethod("compareto",
    function(value, element, field) {
        var id = element.id;
        var n = id.lastIndexOf("_");
        if (n == -1) {
            id = field;
        } else {
            id = id.substring(0, n + 1) + field;
        }
        var val = $("#" + id).val();
        return this.optional(element) || value == val;
    });

jQuery.validator.unobtrusive.adapters.addSingleVal("compareto", "field");

//jQuery.validator.addMethod("requiredif", function (value, element, field) {
//    var id = element.id;
//    var n = id.lastIndexOf("_");
//    if (n == -1) {
//        id = field;
//    } else {
//        id = id.substring(0, n + 1) + field;
//    }
//    var val = $("#" + id).val();
//    return this.optional(element) || value == val;
//});

//jQuery.validator.unobtrusive.adapters.addSingleVal("requiredif", "field");

$.validator.addMethod("requiredif",
    function(value, element, parameters) {
        var id = "#" + parameters["dependentproperty"];

        // get the target value (as a string, 
        // as that's what actual value will be)
        var targetvalue = parameters["targetvalue"];
        targetvalue =
            (targetvalue == null ? "" : targetvalue).toString();

        // get the actual value of the target control
        // note - this probably needs to cater for more 
        // control types, e.g. radios                

        var control = $(id);
        var controltype = control.attr("type");
        var actualvalue =
            controltype === "checkbox" ? $(id + ":checked").val() == undefined ? "false" : "true" : control.text();

        // if the condition is true, reuse the existing 
        // required field validator functionality

        if (controltype === "checkbox") {
            if ((targetvalue == "false" && actualvalue == "false") ||
                (targetvalue == "true" && actualvalue == "true" && value == "")) {
                return $.validator.methods.required.call(
                    this,
                    value,
                    element,
                    parameters);
            }
        } else {
            if (targetvalue == actualvalue) {
                return $.validator.methods.required.call(
                    this,
                    value,
                    element,
                    parameters);
            }
        }

        return true;
    }
);

$.validator.unobtrusive.adapters.add(
    "requiredif",
    ["dependentproperty", "targetvalue"],
    function(options) {
        options.rules["requiredif"] = {
            dependentproperty: options.params["dependentproperty"],
            targetvalue: options.params["targetvalue"]
        };
        options.messages["requiredif"] = options.message;
    });