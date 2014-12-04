var outerHtml = function ($item) {
    return $item.wrapAll('<div>').parent().html();
};