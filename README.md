# jQuery Tagsort plugin
A plugin that uses HTML5 data attributes to dynamically create interactive tags that can be used to filter and sort a set of tagged elements.


Tagsort provides dynamic tag-based element filtering using data attributes to produce tags for a specified set of elements and append those sort tags to the tagsort element .tagSort({options...}) is called on. Tagsort has two filtering options, inclusive and exclusive. Inclusive means that when multiple tags are active, all elements that contain ANY of those tags will be shown. While exclusive means that when multiple tags are active, only elements that contain ALL of those tags will be shown.







###Basic Usage
Tagsort uses a user-defined data-attribute containing a comma-separated list of tags for the element. The data attribute used is data-item-tags="" and must be added to each element with the selector passed to tagsort as an option.


#####JavaScript:
```javascript
$('div.tagsort-tags-container').tagSort({
  selector:'.item-to-tag'
});
```


#####Markup:
```html
<div class="tagsort-tags-container"></div>

<div class="item-to-tag" data-item-tags="tag1,tag3,tag4">Lorem</div>
<div class="item-to-tag" data-item-tags="tag2,tag3,tag4">Ipsum</div>
<div class="item-to-tag" data-item-tags="tag1,tag2">Dolor</div>
<div class="item-to-tag" data-item-tags="tag1,tag2,tag4">Sit</div>
<div class="item-to-tag" data-item-tags="tag3,tag4">Amet</div>
```









###Options:
Tagsort can be used easily by just passing in an item selector, but it also offers some extra options for added functionality.


```selector``` (Required, fallback: ```.item-tagsort```)
The class or element selector tagsort will use to identify tagged items to sort.
Example Values: ```.tagged-item``` or ```div.item-tagsort```


```tagWrapper``` (Optional, default: ```span```)
The HTML element used to wrap the tag as they are appended to the element .tagSort({options...}) was called on
Example Values: ```li``` or ```p``` or ```a```


```displaySelector``` (Optional, default: ```false```)
The selector tagsort will use to display a filtered element's tags in. Use false for no item-specific tag display.
Example Values: ```.tagged-item .tagged-item-tags``` or ```div.item-tagsort > .tags```


```displaySeperator``` (Optional, default: ```' '```)
The character or HTML tagsort will add between the tags displayed in the element referenced by displaySelector.
Example Values: ```/``` or ```·``` or ```<span>&</span>```


```inclusive``` (Optional, default: ```false```)
Choose weather to use inclusive or exclusive filtering. Defaults to exclusive (inclusive = false).
Example Values:```true``` or ```false```


```fadeTime``` (Optional, default: ```200```)
The time (in milliseconds) for elements to fade out and in as they are sorted. Use 0 for no fading.
Example Values: ```100``` or ```400```








###Todo
* Add single-select option
