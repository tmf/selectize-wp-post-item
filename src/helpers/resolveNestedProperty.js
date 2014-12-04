var resolveNestedProperty = function (object, path) {
    return [object].concat(path.split('.')).reduce(function (prev, curr) {
        return prev[curr];
    });
};
