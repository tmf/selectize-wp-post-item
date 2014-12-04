(function($, Selectize){
    'use strict';

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
	
	var outerHtml = function ($item) {
	    return $item.wrapAll('<div>').parent().html();
	};
	
	var resolveNestedProperty = function (object, path) {
	    return [object].concat(path.split('.')).reduce(function (prev, curr) {
	        return prev[curr];
	    });
	};
	
	
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
	
	
})(jQuery, Selectize);