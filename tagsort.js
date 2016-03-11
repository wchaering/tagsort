;(function($) {
  $.fn.tagSort = function(options) {
    // Default options
    var defaults = {
      items: '.item-tagsort',
      tagElement: 'span',
      tagClassPrefix: false,
      itemTagsView: false,
      itemTagsSeperator: ' ',
      itemTagsElement: false,
      sortType: 'exclusive',
      fadeTime: 0,
      reset: false
    };
    // Overwrite defaults with any user-supplied options
    options = $.extend(defaults, options);
    // Namespace
    var tagSortEngine = {
      generateTags: function(elements) {
        var tags_inclusive = {},
            tags_exclusive = {pointers: [], tags: []},
            tagElement = $(document.createElement(options.tagElement));
        // Loop through tagged elements
        elements.each(function(i){
          $element = $(this);
          // Pull tags from element data attribute and dump into array
          var tagsData = $element.data('item-tags'),
              elementTags = tagsData.match(/,\s+/) ? tagsData.split(', ') : tagsData.split(',');
            // Inclusive Filtering only: Loop through each element's tags
            $.each(elementTags, function(key, v){
              var tagName = v.toLowerCase();
              // Move tags to object as property names if they don't already exist 
              // Set property value to empty array 
              if(!tags_inclusive[tagName]){
                tags_inclusive[tagName] = [];
                //Add tag name as class to each tag element with optional prefix if the user sets tagClass = true
                tagSortEngine.container.append(options.tagClassPrefix !== false ? tagElement.clone().text(v).addClass((options.tagClassPrefix + v.toLowerCase()).replace(/[!\"#$%&'\(\)\*\+,\.\/:;<=>\?\@\[\\\]\^`\{\|\}~]/g, '')) : tagElement.clone().text(v));
              }
              // Append tags to the element if they should be displayed
              if(options.itemTagsView !== false){
                if(options.itemTagsElement !== false){
                  $element.find(options.itemTagsView).append($(document.createElement(options.itemTagsElement)).clone().text(v));
                }
                else {
                  $element.find(options.itemTagsView).append(key > 0 ? options.itemTagsSeperator + v : v);
                }
              }
              // Push elements to array for each tag they have
              tags_inclusive[tagName].push(i);
            });
          // Exclusive Filtering: Push elements to array and push array 
          // of the element's tags to second array (index of element and its tags match)
          if(options.sortType == 'exclusive'){
            tags_exclusive.pointers.push(i);
            tags_exclusive.tags.push(elementTags);
          }
        });
        // Return proper object based on filter type
        if(options.sortType == 'inclusive' || options.sortType == 'single'){
          return tags_inclusive;
        }
        if(options.sortType == 'exclusive') {
          return tags_exclusive;
        }
      },
      exclusiveSort: function(tags){
        var display = [[],[]];
        // Loop through each element and push elements that will be hidden 
        // to display[0] and elements that will be shown to display[1]
        $.each(tags.pointers, function(key, pointer){
          var showElement = true;
          // Loop through all active tags and check that element matches all of them
          // otherwise push to display[0]
          tagSortEngine.container.find('.tagsort-active').each(function(i){
            if(tags.tags[key].indexOf($(this).text()) == -1){
              showElement = false;
              display[0].push(pointer);
            }
          });
          if(showElement == true){
            display[1].push(pointer);
          }
        });
        return display;
      },
      inclusiveSort: function(tags, pointers){
        var display = [pointers,[]];
        // Loop through active tags and push each element matching any active tag
        // to display[1], leaving all other tags in display[0]
        tagSortEngine.container.find('.tagsort-active').each(function(i){
          $.each(tags[$(this).text().toLowerCase()], function(key, pointer){
            display[0].splice(display[0].indexOf(pointer), 1);
            display[1].push(pointer);
          });
        });
        return display;
      },
      showElements: function(pointers, elements){
        // Fade in elements in display[1]
        $.each(pointers, function(key, pointer){
            elements.eq(pointer).fadeIn(options.fadeTime);
        });
      },
      hideElements: function(pointers, elements){
        // Fade out elements in display[0]
        $.each(pointers, function(key, pointer){
            elements.eq(pointer).fadeOut(options.fadeTime);
        });
      },
      inititalize: function(tagsContainer){
        tagSortEngine.container = tagsContainer;
        var elements = $(options.items),
            pointers = [],
            display,
            reset = options.reset;
        // Create array of pointers to represent elements
        for(var i = 0; i < elements.length; i++){
          pointers.push(i);
        }
        // Generate tags from element data-attributes
        tagSortEngine.tags = tagSortEngine.generateTags(elements, tagSortEngine.container);
        // Get all clickable tag elements
        var tagElement = tagSortEngine.container.find(options.tagElement);
        // Handle tag click based on user options
        tagElement.click(function(){
          // Handle single filtering (inclusive sort run one tag at a time)
          if(options.sortType == 'single'){
            if($(this).hasClass('tagsort-active')){
              $(this).toggleClass('tagsort-active');
            }
            else {
              $('.tagsort-active').removeClass('tagsort-active');
              $(this).toggleClass('tagsort-active');
              display = tagSortEngine.inclusiveSort(tagSortEngine.tags, pointers.slice());
            }
          }
          // Handle inclusive or exclusive filtering
          else { 
            $(this).toggleClass('tagsort-active');
            display = (options.sortType == 'inclusive') ? tagSortEngine.inclusiveSort(tagSortEngine.tags, pointers.slice()) : tagSortEngine.exclusiveSort(tagSortEngine.tags);
          }
          // Show all elements if no tags are selected
          if(!tagElement.hasClass('tagsort-active')) display = [[],pointers.slice()];
          // Show/hide tagged elements
          if(display[0].length > 0) tagSortEngine.hideElements(display[0], elements);
          if(display[1].length > 0) tagSortEngine.showElements(display[1], elements);
        });
        if(reset){
          $(reset).click(function(){
            $('.tagsort-active').removeClass('tagsort-active');
            display = [[],pointers.slice()];
            tagSortEngine.showElements(display[1], elements);
          });
        }
      }
    }
    // Start it up
    tagSortEngine.inititalize(this);
    return $(this);
  }
})(jQuery);