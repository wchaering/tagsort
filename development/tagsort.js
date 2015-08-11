;(function($) {
  $.fn.tagSort = function(options) {
      var defaults = {
        selector: '.item-tagsort',
        displaySelector: false,
        displaySeperator: ' ',
        inclusive: false, 
        fadeTime: 200
      };
      options = $.extend(defaults, options);

      var tagSortEngine = {
        generateTags: function(elements) {
          var tags_inclusive = {};
          var tags_exclusive = {elements: [], tags: []};
          elements.each(function(i){
            $element = $(this)
            ;
            var tagsData = $element.data('item-tags'),
            elementTags = tagsData.match(/,\s+/) ? tagsData.split(', ') : tagsData.split(',');

            $.each(elementTags, function(i, v){
              var tagName = v.toLowerCase();
              if(!tags_inclusive[tagName]){
                tags_inclusive[tagName] = [];
                tagSortEngine.container.append('<span>'+v+'</span>');

              }
              if(options.displaySelector !== false){
                $element.find(options.displaySelector).append(i > 0 ? options.displaySeperator + v : v);
              }
              tags_inclusive[tagName].push($element);
            });

            tags_exclusive.elements.push($element);
            tags_exclusive.tags.push(elementTags);
          });
          return options.inclusive == true ? tags_inclusive:tags_exclusive;
        },
        exclusiveSort: function(tags, elements){
          var display = [[],[]];
          $.each(tags.elements, function(element_key, element){
            var showElement = true;
            tagSortEngine.container.find('.tagsort-active').each(function(i){
              if(tags.tags[element_key].indexOf($(this).text()) == -1){
                showElement = false;
                display[0].push(element);
              }
            });

            if(showElement == true) {
              display[1].push(element);
            }
          });
          return display;
        },
        inclusiveSort: function(tags, elements){
          var display = [[],[]]
          $container.find('.tagsort-active').each(function(i){
            $.each(tags[$(this).text().toLowerCase()],function(element_key, element){
              display[1].push(element);

            });
          });
          return display;
        },
        inititalize: function(tagsContainer){
          tagSortEngine.container = tagsContainer;
          tagSortEngine.container.addClass('tagsort-tags-container');
          var elements = $(options.selector);
          tagSortEngine.tags = tagSortEngine.generateTags(elements, tagSortEngine.container);
          var tagElement = tagSortEngine.container.find('span');
          tagElement.click(function(){
            $(this).toggleClass('tagsort-active');
            if(!tagElement.hasClass('tagsort-active')){
              elements.fadeIn(options.fadeTime);
            }
            else {
              elements.fadeOut(options.fadeTime);
              var display = options.inclusive == true ? tagSortEngine.inclusiveSort(tagSortEngine.tags, elements):tagSortEngine.exclusiveSort(tagSortEngine.tags, elements);
              if(display[0].length > 0){
                $.each(display[0], function(hide_key, toHide){
                  if(toHide.is(':visible')){
                    toHide.fadeOut(options.fadeTime);
                  }
                });
              }
              if(display[1].length > 0){
                $.each(display[1], function(hide_key, toShow){
                  if(!toShow.is('visible')){
                    toShow.fadeIn(options.fadeTime);
                  }
                });
              }
            }
          });
        }
      }
      tagSortEngine.inititalize(this);
      return $(this);
    }
})(jQuery);