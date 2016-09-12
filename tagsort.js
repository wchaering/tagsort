;(function($) {
  var tagSortEngine;
  $.fn.tagSort = function(options) {
    // Default options
    var defaults = {
      items: '.item-tagsort',
      tagElement: 'span',
      selectedTags: [],
      tagClassPrefix: false,
      itemTagsView: false,
      itemTagsSeperator: ' ',
      itemTagsElement: false,
      sortType: 'exclusive',
      fadeTime: 0,
      sortAlphabetical: false,
      reset: false,
      getElement: function(element){ return element; },
    };
    // Overwrite defaults with any user-supplied options

    // Namespace
    tagSortEngine = {
      generateTags: function() {
        var tags_inclusive = {},
            tags_exclusive = {pointers: [], tags: []},
            tagElement = $(document.createElement(tagSortEngine.options.tagElement));
        // Loop through tagged elements
        tagSortEngine.container.html('');
        tagSortEngine.elements.each(function(i) {
          $element = $(this);
          // Pull tags from element data attribute and dump into array
          var tagsData = $element.attr('data-item-tags')
          tagsData = (typeof tagsData === 'string' && tagsData !== '') ?  tagsData : 'Untagged';
          var elementTags = tagsData.match(/,\s+/) ? tagsData.split(', ') : tagsData.split(',');
            // Inclusive Filtering only: Loop through each element's tags
            $.each(elementTags, function(key, v) {
              var tagName = v;
              var tagPropertyName = tagName.toLowerCase();
              // Move tags to object as property names if they don't already exist
              // Set property value to empty array
              if (!tags_inclusive[tagPropertyName]) {
                tags_inclusive[tagPropertyName] = [];
                //Add tag name as class to each tag element with optional prefix if the user sets tagClass = true
                var tag = (tagSortEngine.options.tagClassPrefix !== false) ? tagElement.clone().text(tagName).addClass((tagSortEngine.options.tagClassPrefix + v.toLowerCase()).replace(/[!\"#$%&'\(\)\*\+,\.\/:;<=>\?\@\[\\\]\^`\{\|\}~]/g, '')) : tagElement.clone().text(tagName);
                if(tagSortEngine.options.selectedTags.includes(tagName))
                  tag.addClass('active');
                tagSortEngine.container.append(tag);
              }
              // Append tags to the element if they should be displayed
              if (tagSortEngine.options.itemTagsView !== false) {
                if (tagSortEngine.options.itemTagsElement !== false) {
                  $element.find(tagSortEngine.options.itemTagsView).append($(document.createElement(tagSortEngine.options.itemTagsElement)).clone().text(v));
                }
                else {
                  $element.find(tagSortEngine.options.itemTagsView).append(key > 0 ? tagSortEngine.options.itemTagsSeperator + v : v);
                }
              }
              // Push elements to array for each tag they have
              tags_inclusive[tagPropertyName].push(i);
            });
          // Exclusive Filtering: Push elements to array and push array
          // of the element's tags to second array (index of element and its tags match)
          if (tagSortEngine.options.sortType == 'exclusive') {
            tags_exclusive.pointers.push(i);
            tags_exclusive.tags.push(elementTags);
          }

        });
        // Return proper object based on filter type
        if (tagSortEngine.options.sortType == 'inclusive' || tagSortEngine.options.sortType == 'single') {
          return tags_inclusive;
        }
        if (tagSortEngine.options.sortType == 'exclusive') {
          return tags_exclusive;
        }
      },
      exclusiveSort: function(tags) {
        var display = [[],[]];
        // Loop through each element and push elements that will be hidden
        // to display[0] and elements that will be shown to display[1]
        $.each(tags.pointers, function(key, pointer) {
          var showElement = true;
          // Loop through all active tags and check that element matches all of them
          // otherwise push to display[0]
          tagSortEngine.container.find('.active').each(function(i) {
            if (tags.tags[key].indexOf($(this).text()) == -1) {
              showElement = false;
              display[0].push(pointer);
            }
          });
          if (showElement == true) {
            display[1].push(pointer);
          }
        });
        return display;
      },
      inclusiveSort: function(tags, pointers) {
        var display = [pointers,[]];
        // Loop through active tags and push each element matching any active tag
        // to display[1], leaving all other tags in display[0]
        tagSortEngine.container.find('.active').each(function(i) {
          $.each(tags[$(this).text().toLowerCase()], function(key, pointer) {
            display[0].splice(display[0].indexOf(pointer), 1);
            display[1].push(pointer);
          });
        });
        return display;
      },
      showElements: function(pointers, elements) {
        // Fade in elements in display[1]
        $.each(pointers, function(key, pointer) {
            element = elements.eq(pointer);
            element = tagSortEngine.options.getElement(element);
            element.fadeIn(tagSortEngine.options.fadeTime);
        });
      },
      hideElements: function(pointers, elements) {
        // Fade out elements in display[0]
        $.each(pointers, function(key, pointer) {
          element = elements.eq(pointer);
          element = tagSortEngine.options.getElement(element);
          element.fadeOut(tagSortEngine.options.fadeTime);
        });
      },
      inititalize: function(tagsContainer) {
        tagSortEngine.options = $.extend(defaults, options);
        console.log(tagSortEngine.options);
        tagSortEngine.container = tagsContainer;
        tagSortEngine.elements = $(tagSortEngine.options.items);
        tagSortEngine.pointers = [];
        var tdisplay,
            reset = tagSortEngine.options.reset;
        // Create array of pointers to represent elements
        for(var i = 0; i < tagSortEngine.elements.length; i++) {
          tagSortEngine.pointers.push(i);
        }
        // Generate tags from element data-attributes
        tagSortEngine.tags = tagSortEngine.generateTags(tagSortEngine.lements, tagSortEngine.container);
        // Get all clickable tag elements
        tagSortEngine.tagElements = tagSortEngine.container.find(tagSortEngine.options.tagElement);

        if (tagSortEngine.options.sortAlphabetical) {
            // Sort values.
            var sortedTags = tagSortEngine.tagElements.toArray().sort(function(a, b) {
                return a.innerText > b.innerText;
            });

            // Remove unsorted values.
            tagSortEngine.container.empty();

            // Add sorted values.
            $.each(sortedTags, function (index, value) {
                tagSortEngine.container.append(value);
            });
        }
        tagSortEngine.sort();

        // Handle tag click based on user options
        tagSortEngine.tagElements.click(function() {
          // Handle single filtering (inclusive sort run one tag at a time)
          if (tagSortEngine.options.sortType == 'single') {
            if ($(this).hasClass('active')) {
              $(this).removeClass('active');
            }
            else {
              tagSortEngine.container.find('.active').removeClass('active');
              $(this).addClass('active');

            }
          }
          // Handle inclusive or exclusive filtering
          else {
            $(this).toggleClass('active');
          }
          tagSortEngine.sort();

        });
        if (reset) {
          $(reset).click(function() {
            tagSortEngine.container.find('.active').removeClass('active');
            display = [[],pointers.slice()];
            tagSortEngine.showElements(display[1], elements);
          });
        }
      },
      sort: function(){
        // Handle single filtering (inclusive sort run one tag at a time)

        if (tagSortEngine.options.sortType === 'single') {
            tagSortEngine.display = tagSortEngine.inclusiveSort(tagSortEngine.tags, tagSortEngine.pointers.slice());
        }
        // Handle inclusive or exclusive filtering
        else {
          tagSortEngine.display = (tagSortEngine.options.sortType === 'inclusive') ? tagSortEngine.inclusiveSort(tagSortEngine.tags, tagSortEngine.pointers.slice()) : tagSortEngine.exclusiveSort(tagSortEngine.tags);
        }
        // Show all elements if no tags are selected
        if (!tagSortEngine.tagElements.hasClass('active')) tagSortEngine.display = [[], tagSortEngine.pointers.slice()];
        // Show/hide tagged elements
        if (tagSortEngine.display[0].length > 0) tagSortEngine.hideElements(tagSortEngine.display[0], tagSortEngine.elements);
        if (tagSortEngine.display[1].length > 0) tagSortEngine.showElements(tagSortEngine.display[1], tagSortEngine.elements);
      }
    }

    // Start it up
    tagSortEngine.inititalize(this);
    return $(this);
  }
})(jQuery);
