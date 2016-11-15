// NAMESPACE/CLOSURE
var CLEVERCLEVER = function () {

    function create(tagName, content, attributes) {

        var element = document.createElement(tagName);

        if (content != undefined) {

            if (Array.isArray(content)) {

                for (var e = 0; e < content.length; e++) {
                    element.appendChild(content[e]);
                }

            } else {
                element.innerHTML = content;
            }
        }

        if (attributes) {

            var keys = Object.keys(attributes);

            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                element[key] = attributes[key];
            }

        }

        return element;

    }


    function Button(caption, handler, attributes) {
        var button = create("button", caption, attributes);
        button.addEventListener("click", handler);
        return button;
    }


    function insertAfter(item, button) {
        item.parentElement.insertBefore(button, item.nextSibling);
    }


    function DateRange(startDate, endDate) {

        function toString() {
            return startDate.toISOString().split("T")[0] +
                " " +
                endDate.toISOString().split("T")[0];
        }

        return {
            "startDate": startDate,
            "endDate": endDate,
            "toString": toString
        }

    }

    return {
        insertAfter: insertAfter,
        Button: Button,
        create: create,
        DateRange: DateRange
    };
}();

