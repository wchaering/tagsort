# jQuery Tagsort plugin
A plugin that uses HTML5 data attributes to dynamically create interactive tags that can be used to filter a set of tagged elements.

Demos and docs for the plugin are avaliable [here](http://wch.io/projects/tagsort/ "Tagsort Demo").


###Description
Tagsort takes a set of tagged elements allows them to be filtered in a number of ways. The set of tags is appended to an element and can be selected to inclusively or exclusively show matching elements. Inclusive filtering will show all elements that have any of the selected tags. Exclusive filtering will only show elements that have all of the selected tags. Single filtering will only allow one tag at a time to be selected and show the elements that match that tag.


###Basic Usage
Tagsort uses a user-defined data-attribute containing a comma-separated list of tags to tag each element. The data attribute used is `data-item-tags=""` and must be added to each element to be filtered.


Markup
```html
<div class="tagsort-tags-container"></div>

<div class="item-to-filter" data-item-tags="tag1,tag3,tag4">Lorem</div>
<div class="item-to-filter" data-item-tags="tag2,tag3,tag4">Ipsum</div>
<div class="item-to-filter" data-item-tags="tag1,tag2">Dolor</div>
<div class="item-to-filter" data-item-tags="tag1,tag2,tag4">Sit</div>
<div class="item-to-filter" data-item-tags="tag3,tag4">Amet</div>
```


JavaScript
```javascript
$('div.tagsort-tags-container').tagSort({
  items:'.item-to-filter'
});
```

JavaScript with Options
```javascript
$('div.tagsort-tags-container').tagSort({
  items: '.item-tagsort',
  tagElement: 'span',
  tagClassPrefix: false,
  itemTagsView: false,
  itemTagsSeperator: ' ',
  itemTagsElement: false,
  sortType: 'exclusive',
  fadeTime: 0
});
```


###Options:
Tagsort can be used simply by passing in a sort item selector but it also offers some extra options for added functionality.


**`items` (Required, fallback: `.item-tagsort`)**

The class or selector used to identify tagged items.

Example Values: ```.tagged-item``` or ```div.item-tagsort```

===
**`tagElement` (Optional, default: `span`)**

The HTML element used for the tags added to the container.

Example Values: ```li``` or ```p``` or ```a```

===
**`tagClassPrefix` (Optional, default: `false`)**

Used to provide a prefix for the selectable tags' classes to make CSS simpler. Classes will be added as the prefix + the tagname. If false, no classes will be added.

Example Values: ```false``` or ```tagsort-``` or ```color-```

===
**`itemTagsView` (Optional, default: `false`)**

Provide a selector that Tagsort will append each elements' individual tags to. Use ```false``` for no element tag display.

Example Values: ```.tagged-item .tagged-item-tags``` or ```div.item-tagsort > .tags```

===
**`itemTagsSeperator` (Optional, default: `' '`)**

The character or HTML Tagsort will insert between the tags displayed in the element's tag display referenced by `displaySelector`.

Example Values: ```/``` or ```·``` or ```<span>&</span>```

===
**`itemTagsElement` (Optional, default: `false`)**

Allows item tags shown to be wrapped with HTML elements instead of a seperator.

Example Values: ```b``` or ```i```

===
**`sortType` (Optional, default: `'exclusive'`)**

Choose the way Tagsort will handle element filtering.

Example Values:```exclusive``` or ```inclusive``` or ```single```

===
**`fadeTime` (Optional, default: `200`)**

The time (in milliseconds) for filtered elements to fade in and out. 0 removes transition entirely.

Example Values: ```100``` or ```400```

===
**`reset` (Optional, default: `false`)**

Specify an element that, when clicked, will return the sorted elements to their initial state by resetting all tags. No default element is used.

Example Values: ```.tagsort-reset``` or ```#button-tags-reset```


###Todo
* ~~Add reset functionality~~
* Prevent exclusive filter from showing no elements
* ~~Clean up element display on sort (less flashing in and out)~~
* Smoother handling of sorts where no elements match (similar to above)
