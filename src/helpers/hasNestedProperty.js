var hasNestedProperty = function (object, propertyString) {
    // If no property passed, return the object.
    if (!propertyString) {
        return object;
    }

    var prop,
        sepIndex = propertyString.indexOf('.');
    // If it is the last property
    if (sepIndex === -1) {
        prop = propertyString;
        if (object.hasOwnProperty(prop)) {
            return object[prop];
        }
        return;
    }

    // If not the last property, call nestedProperty again.
    prop = propertyString.slice(0, sepIndex);
    if (object.hasOwnProperty(prop)) {
        return hasNestedProperty(object[prop], propertyString.slice(++sepIndex));
    }
    return;
};