;(function($) {
  $.fn.tagSort = function(options) {
      // Set up default options
      var defaults = {
        selector: '.item-tagsort',
        tagWrapper: 'span',
        displaySelector: false,
        displaySeperator: ' ',
        sortType: 'exclusive',
        fadeTime: 200
      };
      // Overwrite defaults with any user-supplied options
      options = $.extend(defaults, options);

      // Function wrapper
      var tagSortEngine = {
        generateTags: function(elements) {
          var tags_inclusive = {};
          var tags_exclusive = {elements: [], tags: []};
          var tagElement = $(document.createElement(options.tagWrapper));

          // Loop through tagged elements
          elements.each(function(i){
            $element = $(this);
            // Pull tags from element data attribute and dump into array
            var tagsData = $element.data('item-tags'),
            elementTags = tagsData.match(/,\s+/) ? tagsData.split(', ') : tagsData.split(',');
            
            // Inclusive Filtering only: Loop through element's tags
            $.each(elementTags, function(i, v){
              var tagName = v.toLowerCase();
              // Move tags to object as property names if they don't exist already
              // Set property value to empty array 
              if(!tags_inclusive[tagName]){
                tags_inclusive[tagName] = [];
                tagSortEngine.container.append(tagElement.clone().text(v));
              }
              // Append tags to the element if they should be displayed
              if(options.displaySelector !== false){
                $element.find(options.displaySelector).append(i > 0 ? options.displaySeperator + v : v);
              }
              // Push elements to array for each tag they have
              tags_inclusive[tagName].push($element);
            });
            // Exclusive Filtering: Push elements to array and push array 
            // of the element's tags to second array (index of element and its tags match)
            tags_exclusive.elements.push($element);
            tags_exclusive.tags.push(elementTags);
          });
          // Return proper object based on filter type
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
          // Loop through each element and push elements that will be hidden 
          // to display[0] and elements that will be shown to display[1]
          $.each(tags.elements, function(element_key, element){
            var showElement = true;
            // Loop through all active tags and check that element matches all of them
            // otherwise push to display[0]
            tagSortEngine.container.find('.tagsort-active').each(function(i){
              if(tags.tags[element_key].indexOf($(this).text()) == -1){
                showElement = false;
                display[0].push(element);
              }
            });
            if(showElement == true){
              display[1].push(element);
            }
          });
          return display;
        },
        inclusiveSort: function(tags, elements){
          var display = [[],[]]
          // Loop through active tags and push each element matching any active tag
          // to display[1] (no need for display[0])
          tagSortEngine.container.find('.tagsort-active').each(function(i){
            $.each(tags[$(this).text().toLowerCase()],function(element_key, element){
              display[1].push(element);

            });
          });
          return display;
        },
        showElements: function(arr){
          // FadeIn elements in display[1]
          $.each(arr, function(hide_key, toShow){
            if(!toShow.is('visible')){
              toShow.fadeIn(options.fadeTime);
            }
          });
        },
        hideElements: function(arr){
          // FadeOut elements in display[0]
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
          // Generate tags from element data-attributes
          tagSortEngine.tags = tagSortEngine.generateTags(elements, tagSortEngine.container);
          // Get all clickable tag elements
          var tagElement = tagSortEngine.container.find(options.tagWrapper);
          // Handle tag click based on user options
          tagElement.click(function(){
            var tagActive = tagElement.hasClass('tagsort-active');
            // show all elements if no tags are active
            if(!tagActive){
                elements.fadeIn(options.fadeTime);
            }
            elements.fadeOut(options.fadeTime);
            // Handle single filtering (inclusive sort run one tag at a time)
            if(options.sortType == 'single'){
              if($(this).hasClass('tagsort-active')){ // Unselect tag if already selected and show all elements
                elements.fadeIn(options.fadeTime);
                $(this).removeClass('tagsort-active');
              }
              else { // Run inclusive sort
              $('.tagsort-active').removeClass('tagsort-active');
              $(this).toggleClass('tagsort-active');
              var display = tagSortEngine.inclusiveSort(tagSortEngine.tags, elements);
              }
            }
            else { // Handle inclusive or exclusive filtering
                $(this).toggleClass('tagsort-active');
                var display = options.sortType == 'inclusive' ? tagSortEngine.inclusiveSort(tagSortEngine.tags, elements):tagSortEngine.exclusiveSort(tagSortEngine.tags, elements);
            }
            // Show/hide elements
            if(display[0].length > 0){
              tagSortEngine.hideElements(display[0]);
            }
            if(display[1].length > 0){
              tagSortEngine.showElements(display[1]);
            }
          });
        }
      }
      // Start 'er up
      tagSortEngine.inititalize(this);
      return $(this);
    }
})(jQuery);