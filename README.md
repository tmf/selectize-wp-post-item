selectize.js WordPress Post item plugin
=======================================

This selectize.js plugin can be used to display WordPress post data: it adds renderers to display additional information in the items and the options.
Currently the following information will be rendered, if any of the following fields are present in the item data object:
 - `post_thumbnail.thumbnail`: a post thumbnail on the left
 - `post_title`: the post excerpt in bold, only in the dropdown
 - `post_date`: the post date
 - `post_type`: possibly a custom post type, only in the dropdown
 - `post_excerpt`: only in the dropdown
 - `post_author`: the post author, only in the dropdown
 
Usage
-----

- include the `dist/css/plugins.css` and the `dist/js/plugins.js` in your page
- initialize your selectize.js `<select>` dropdown with the following plugin:
    ```js
    $('select').selectize({
        options: ['wp_post_item']
    });
    ```
    