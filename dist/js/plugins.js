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
	        thumbnailClassName: 'item-thumbnail',
	        titleField: 'post_title',
	        dateField: 'post_date',
	        excerptField: 'post_excerpt',
	        authorField: 'post_author_nicename'
	    }, options);
	
	    var self = this;
	
	    var prependThumbnail = function (itemHtml, data) {
	        if (hasNestedProperty(data, options.thumbnailField)) {
	            var $image = $('<img>').attr('src', resolveNestedProperty(data, options.thumbnailField)).wrapAll('<div>').parent().addClass(options.thumbnailClassName);
	            itemHtml = outerHtml($(itemHtml).prepend($image));
	        }
	        return itemHtml;
	    };
	
	    var formatPost = function(itemHtml, data){
	        if(hasNestedProperty(data, options.titleField)){
	            var $title = $('<span>').text(resolveNestedProperty(data, options.titleField)).addClass('title'),
	                $date = $('<span>').text(resolveNestedProperty(data, options.dateField)).addClass('date'),
	                $excerpt = $('<span>').text(resolveNestedProperty(data, options.excerptField)).addClass('excerpt'),
	                $author = $('<span>').text(resolveNestedProperty(data, options.authorField)).addClass('author'),
	                $itemHtml = $(itemHtml);
	
	            // remove original text matching the post title
	            $itemHtml.contents().filter(function(){
	                return this.nodeType == 3 && this.textContent.trim() === resolveNestedProperty(data, options.titleField);
	            }).remove();
	            $itemHtml.prepend([$title, $date, $author, $excerpt]);
	            itemHtml = outerHtml($itemHtml);
	        }
	        return itemHtml;
	    };
	
	    self.setup = (function () {
	        var original = self.setup;
	        return function () {
	            var render_item = self.settings.render.item,
	                render_option = self.settings.render.option;
	            self.settings.render.item = function (data) {
	                return prependThumbnail(formatPost(render_item.apply(this, arguments), data), data);
	            };
	            self.settings.render.option = function (data) {
	                return prependThumbnail(formatPost(render_item.apply(this, arguments), data), data);
	            };
	            original.apply(self, arguments);
	        };
	    })();
	});
	
	
})(jQuery, Selectize);