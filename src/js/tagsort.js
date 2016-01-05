;(function($) {
  $.fn.tagSort = function(options) {
      var defaults = {
        selector: '.item-tagsort',
        tagWrapper: 'span',
        displaySelector: false,
        displaySeperator: ' ',
        sortType: 'exclusive',
        fadeTime: 200
      };
      options = $.extend(defaults, options);

      var tagSortEngine = {
        generateTags: function(elements) {
          var tags_inclusive = {};
          var tags_exclusive = {elements: [], tags: []};
          var tagElement = $(document.createElement(options.tagWrapper));
          elements.each(function(i){
            $element = $(this)
            ;
            var tagsData = $element.data('item-tags'),
            elementTags = tagsData.match(/,\s+/) ? tagsData.split(', ') : tagsData.split(',');
            
            $.each(elementTags, function(i, v){
              var tagName = v.toLowerCase();
              if(!tags_inclusive[tagName]){
                tags_inclusive[tagName] = [];
                tagSortEngine.container.append(tagElement.clone().text(v));
              }
              if(options.displaySelector !== false){
                $element.find(options.displaySelector).append(i > 0 ? options.displaySeperator + v : v);
              }
              tags_inclusive[tagName].push($element);
            });

            tags_exclusive.elements.push($element);
            tags_exclusive.tags.push(elementTags);
          });
          if(options.sortType == 'inclusive'){
            return tags_inclusive;
          }
          if(options.sortType == 'exclusive') {
            return tags_exclusive;
          }
          if(options.sortType == 'single'){
            return tags_inclusive;
          }
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
          tagSortEngine.container.find('.tagsort-active').each(function(i){
            $.each(tags[$(this).text().toLowerCase()],function(element_key, element){
              display[1].push(element);

            });
          });
          return display;
        },
        showElements: function(arr){
          $.each(arr, function(hide_key, toShow){
            if(!toShow.is('visible')){
              toShow.fadeIn(options.fadeTime);
            }
          });
        },
        hideElements: function(arr){
          $.each(arr, function(hide_key, toHide){
            if(toHide.is('visible')){
              toHide.fadeOut(options.fadeTime);
            }
          });
        },
        inititalize: function(tagsContainer){
          tagSortEngine.container = tagsContainer;
          tagSortEngine.container.addClass('tagsort-tags-container');
          var elements = $(options.selector);
          tagSortEngine.tags = tagSortEngine.generateTags(elements, tagSortEngine.container);
          var tagElement = tagSortEngine.container.find(options.tagWrapper);
          tagElement.click(function(){
            var tagActive = tagElement.hasClass('tagsort-active');
            if(!tagActive){
                elements.fadeIn(options.fadeTime);
            }
            elements.fadeOut(options.fadeTime);
            if(options.sortType == 'single'){
              $('.tagsort-active').removeClass('tagsort-active');
              $(this).toggleClass('tagsort-active');
              var display = tagSortEngine.inclusiveSort(tagSortEngine.tags, elements);
            }
            else {
                $(this).toggleClass('tagsort-active');
                var display = options.sortType == 'inclusive' ? tagSortEngine.inclusiveSort(tagSortEngine.tags, elements):tagSortEngine.exclusiveSort(tagSortEngine.tags, elements);
            }
            if(display[0].length > 0){
              tagSortEngine.hideElements(display[0]);
            }
            if(display[1].length > 0){
              tagSortEngine.showElements(display[1]);
            }
          });
        }
      }
      tagSortEngine.inititalize(this);
      return $(this);
    }
})(jQuery);