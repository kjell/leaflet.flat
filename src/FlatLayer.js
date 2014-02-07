L.FlatLayer = L.TileLayer.extend({
  initialize: function (url, options) {
    L.extend(options, { crs: L.CRS.Simple })
    options.crs.infinite = false
    
    // start with `L.TileLayer`'s `initialize`
    L.TileLayer.prototype.initialize.call(this, url, options)

    if(options.width) {
      var w = options.width
        , h = options.height
    }

    this.on('tileload', this._adjustNonSquareTile)
    this.on('add', this._addedToMap)
    window.flat = this
  },

  _addedToMap: function () {
    this._map.options.continuousWorld = false
    this._map.options.worldCopyJump = false
    console.log(this._boundAndZoom())
  },

  _adjustNonSquareTile: function (data) {
    var tile = data.tile
    tile.style.width = tile.naturalWidth + 'px'
    tile.style.height = tile.naturalHeight + 'px'
  },

  _isValidTile: function (coords) {
    var _super = false && L.TileLayer.prototype._isValidTile.call(this, coords)
      , bounds = this._tileNumBounds
      , currentZoom = Math.max(0, Math.ceil(this._map.getZoom()))
      // What exactly is `something`? I need to understand it before I can name it
      // It does math and compares the size of one tile at the current
      // zoom with the dimensions of the full sized image. Also check if
      // leaflet has a method to do this.
      , something = this.options.crs.scale(this._map.getMaxZoom() - currentZoom)
      , limit = function(dimension) {
        return Math.ceil(dimension / something / this._getTileSize())
      }.bind(this)
      , xlimit = limit(this.options.width)
      , ylimit = limit(this.options.height)

    return coords.x > -1 && coords.x < xlimit &&
           coords.y > -1 && coords.y < ylimit
  },

  _boundAndZoom: function () {
    var slop = 0
      , map = this._map
      , bounds = new L.LatLngBounds(
          map.unproject([slop, this.options.height - slop], map.getMaxZoom()),
          map.unproject([this.options.width - slop, slop], map.getMaxZoom())
        )

    map.setMaxBounds(bounds)
    setTimeout(function() { map.fitBounds(bounds) }, 100) // TODO: fix arbitrary setTimeout
    this.options.minZoom = map.getBoundsZoom(bounds)
    console.log('new minZoom', map.getBoundsZoom(bounds))
    this.options.maxBounds = bounds 
    return bounds
  }
})

L.flatLayer = function (url, options) {
  return new L.FlatLayer(url, options)
}

