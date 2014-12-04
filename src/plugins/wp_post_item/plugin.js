Selectize.define('wp_post_item', function (options) {
    if (this.settings.mode === 'single') return;

    options = $.extend({
        thumbnailField: 'post_thumbnail.thumbnail',
        thumbnailClassName: 'item-thumbnail'
    }, options);

    var self = this;

    var prependThumbnail = function (itemHtml, data) {
        if (hasNestedProperty(data, options.thumbnailField)) {
            var $image = $('<img>').attr('src', resolveNestedProperty(data, options.thumbnailField)).wrapAll('<div>').parent().addClass(options.thumbnailClassName);
            itemHtml = outerHtml($(itemHtml).prepend($image));
        }
        return itemHtml;
    };

    self.setup = (function () {
        var original = self.setup;
        return function () {
            var render_item = self.settings.render.item,
                render_option = self.settings.render.option;
            self.settings.render.item = function (data) {
                return prependThumbnail(render_item.apply(this, arguments), data);
            };
            self.settings.render.option = function (data) {
                return prependThumbnail(render_option.apply(this, arguments), data);
            };
            original.apply(self, arguments);
        };
    })();
});

