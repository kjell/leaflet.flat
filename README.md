Leaflet.flat
====

The world might not be flat, but photographs aren't. Leaflet needs to

* 'un-square' tiles (such as those at the edges of an image where `{width,height} % 256 != 0`
* scale tiles to fill a container, and enable arbitrary zoom levels
* bound the map based on `(width, height)` of image

## Basic Usage

```js
var map = L.map(…)
L.flatLayer("https://…/{z}/{x}/{y}.png", {
  width: 4074,
  height: 5236,
  maxzoom: 5
}).addTo(map)
```
