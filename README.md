# jQuery Tagsort plugin
A plugin that uses HTML5 data attributes to dynamically create interactive tags that can be used to filter and sort a set of tagged elements.

A demo and options to download different versions of the plugin are avaliable [here](http://wch.io/projects/tagsort/ "Tagsort Demo").


###Description
Tagsort provides dynamic tag-based element filtering using data attributes to produce tags for a specified set of elements and append those sort tags to the tagsort element the `$.tagSort(options)` function is called on. Tagsort has three ways to filter elements: inclusive, exclusive, and single. Inclusive filtering will display all elements that have any of the active tags. Exclusive filtering will display only the elements that have every active tag. Single filtering only allows one tag to be selected at a time and shows all elements that match.


###Basic Usage
Tagsort uses a user-defined data-attribute containing a comma-separated list of tags for the element. The data attribute used is `data-item-tags=""` and must be added to each element with the selector passed to tagsort as an option.


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


**`selector` (Required, fallback: `.item-tagsort`)**

The class or element selector tagsort will use to identify tagged items to sort.

Example Values: `.tagged-item` or `div.item-tagsort`


**`tagWrapper` (Optional, default: `span`)**

The HTML element used to wrap the tag text when they are appended to the element .tagSort({options...}) was called on.

Example Values: `li` or `p` or `a`


**`tagClassPrefix` (Optional, default: `false`)**

Give each tag element a class comprised of the defined prefix and the text of the tag (Ex. `color-red`). If `false`, no classes will be added. If a blank string is passed, Tagsort will add classes with no prefix.

Example Values: `false` or `tagsort-` or `color-`


**`displaySelector` (Optional, default: `false`)**

The selector tagsort will use to display a filtered element's tags in. Use false for no item-specific tag display.

Example Values: `.tagged-item .tagged-item-tags` or `div.item-tagsort > .tags`


**`displaySeperator` (Optional, default: `' '`)**

The character or HTML tagsort will add between the tags displayed in the element referenced by displaySelector.

Example Values: `/` or `·` or `<span>&</span>`

**`sortType` (Optional, default: `'exclusive'`)**

Choose the way Tagsort will handle user tag selections and subsequent element filtering.

Example Values:```exclusive``` or ```inclusive``` or ```single```


**`fadeTime` (Optional, default: `200`)**

The time (in milliseconds) for elements to fade out and in as they are sorted. Use 0 for no fading.

Example Values: `100` or `400`


###Todo
* Prevent exclusive filter from showing no elements
* Clean up element display on sort (less flashing in and out)
* Smoother handling of sorts where no elements match (similar to above)
