## dev

An in-progress version being developed in the `master` branch.

#### Breaking changes

* Switched to [longitude, latitude] coordinate order, matching GeoJSON. We anticipate that mapbox-gl-js will be widely used
  with GeoJSON, and in the long term having a coordinate order that is consistent with GeoJSON will lead to less confusion
  and impedence mismatch than will a [latitude, longitude] order.

  The following APIs were renamed:

    * `LatLng` was renamed to `LngLat`
    * `LatLngBounds` was renamed to `LngLatBounds`
    * `Popup#setLatLng` was renamed to `Popup#setLngLat`
    * `Popup#getLatLng` was renamed to `Popup#getLngLat`
    * The `latLng` property of Map events was renamed `lngLat`

  The following APIs now expect array coordinates in [longitude, latitude] order:

    * `LngLat.convert`
    * `LngLatBounds.convert`
    * `Popup#setLngLat`
    * The `center` and `maxBounds` options of the `Map` constructor
    * The arguments to `Map#setCenter`, `Map#fitBounds`, `Map#panTo`, and `Map#project`
    * The `center` option of `Map#jumpTo`, `Map#easeTo`, and `Map#flyTo`
    * The `around` option of `Map#zoomTo`, `Map#rotateTo`, and `Map#easeTo`
    * The `coordinates` properties of video and image sources

* Updated to mapbox-gl-style-spec v8.0.0 ([Changelog](https://github.com/mapbox/mapbox-gl-style-spec/blob/v8.0.0/CHANGELOG.md)). Styles are
  now expected to be version 8. You can use the [gl-style-migrate](https://github.com/mapbox/mapbox-gl-style-lint#migrations)
  utility to update existing styles.
* Removed `mbgl.config.HTTP_URL` and `mbgl.config.FORCE_HTTPS`; https is always used when connecting to the Mapbox API.
* Renamed `mbgl.config.HTTPS_URL` to `mbgl.config.API_URL`.

#### Bugfixes

* Don't draw halo when halo-width is 0 (#1381)
* Reverted shader changes that degraded performance on IE

#### API Improvements

* You can now unset layout and paint properties via the `setLayoutProperty` and `setPaintProperty` APIs
  by passing `undefined` as a property value.
* The `layer` option of `featuresAt` now supports an array of layers.

## 0.9.0 (Jul 29 2015)

* `glyphs` URL now normalizes without the `/v4/` prefix for `mapbox://` urls. Legacy behavior for `mapbox://fontstacks` is still maintained (#1385)
* Expose `geojson-vt` options for GeoJSON sources (#1271)
* bearing snaps to "North" within a tolerance of 7 degrees (#1059)
* Now you can directly mutate the minzoom and maxzoom layer properties with `map.setLayerZoomRange(layerId, minzoom, maxzoom)`
* Exposed `mapboxgl.Control`, a base class used by all UI controls 
* Refactored handlers to be individually included in Map options, or enable/disable them individually at runtime, e.g. `map.scrollZoom.disable()`.
* New feature: Batch operations can now be done at once, improving performance for calling multiple style functions: (#1352)
  
  ```js
  style.batch(function(s) {
      s.addLayer({ id: 'first', type: 'symbol', source: 'streets' });
      s.addLayer({ id: 'second', type: 'symbol', source: 'streets' });
      s.addLayer({ id: 'third', type: 'symbol', source: 'terrain' });
      s.setPaintProperty('first', 'text-color', 'black');
      s.setPaintProperty('first', 'text-halo-color', 'white');
  });
  ```
* Improved documentation
* `featuresAt` performance improvements by exposing `includeGeometry` option
* Better label placement along lines (#1283)
* Improvements to round linejoins on semi-transparent lines (mapbox/mapbox-gl-native#1771)
* Round zoom levels for raster tile loading (2a2aec)
* Source#reload cannot be called if source is not loaded (#1198)
* Events bubble to the canvas container for custom overlays (#1301)
* Move handlers are now bound on mousedown and touchstart events
* map.featuresAt() now works across the dateline

## 0.8.1 (Jun 16 2015)

* No code changes; released only to correct a build issue in 0.8.0.

## 0.8.0 (Jun 15 2015)

#### Breaking changes

* `map.setView(latlng, zoom, bearing)` has been removed. Use
  [`map.jumpTo(options)`](https://www.mapbox.com/mapbox-gl-js/api/#map/jumpto) instead:

  ```js
  map.setView([40, -74.50], 9) // 0.7.0 or earlier
  map.jumpTo({center: [40, -74.50], zoom: 9}); // now
  ```
* [`map.easeTo`](https://www.mapbox.com/mapbox-gl-js/api/#map/easeto) and
  [`map.flyTo`](https://www.mapbox.com/mapbox-gl-js/api/#map/flyto) now accept a single
  options object rather than positional parameters:

  ```js
  map.easeTo([40, -74.50], 9, null, {duration: 400}); // 0.7.0 or earlier
  map.easeTo({center: [40, -74.50], zoom: 9, duration: 400}); // now
  ```
* `mapboxgl.Source` is no longer exported. Use `map.addSource()` instead. See the
  [GeoJSON line](https://www.mapbox.com/mapbox-gl-js/example/geojson-line/) or
  [GeoJSON markers](https://www.mapbox.com/mapbox-gl-js/example/geojson-markers/)
  examples.
* `mapboxgl.util.supported()` moved to [`mapboxgl.supported()`](https://www.mapbox.com/mapbox-gl-js/api/#mapboxgl/supported).

#### UX improvements

* Add perspective rendering (#1049)
* Better and faster labelling (#1079)
* Add touch interactions support on mobile devices (#949)
* Viewport-relative popup arrows (#1065)
* Normalize mousewheel zooming speed (#1060)
* Add proper handling of GeoJSON features that cross the date line (#1275)
* Sort overlapping symbols in the y direction (#470)
* Control buttons are now on a 30 pixel grid (#1143)
* Improve GeoJSON processing performance

#### API Improvements

* Switch to JSDoc for documentation
* Bundling with browserify is now supported
* Validate incoming map styles (#1054)
* Add `Map` `setPitch` `getPitch`
* Add `Map` `dblclick` event. (#1168)
* Add `Map` `getSource` (660a8c1)
* Add `Map` `setFilter` and `getFilter` (#985)
* Add `Map` `failIfMajorPerformanceCaveat` option (#1082)
* Add `Map` `preserveDrawingBuffer` option (#1232)
* Add `VideoSource` `getVideo()` (#1162)
* Support vector tiles with extents other than 4096 (#1227)
* Use a DOM hierarchy that supports evented overlays (#1217)
* Pass `latLng` to the event object (#1068)

#### UX Bugfixes

* Fix rendering glitch on iOS 8 (#750)
* Fix line triangulation errors (#1120, #992)
* Support unicode range 65280-65535 (#1108)
* Fix cracks between fill patterns (#972)
* Fix angle of icons aligned with lines (37a498a)
* Fix dashed line bug for overscaled tiles (#1132)
* Fix icon artifacts caused by sprite neighbours (#1195)

#### API Bugfixes

* Don't fire spurious `moveend` events on mouseup (#1107)
* Fix a race condition in `featuresAt` (#1220)
* Fix for brittle fontstack name convention (#1070)
* Fix broken `Popup` `setHTML` (#1272)
* Fix an issue with cross-origin image requests (#1269)


## 0.7.0 (Mar 3 2015)

#### Breaking

* Rename `Map` `hover` event to `mousemove`.
* Change `featuresAt` to return GeoJSON objects, including geometry (#1010)
* Remove `Map` `canvas` and `container` properties, add `getCanvas` and `getContainer` methods instead

#### UX Improvements

* Improve line label density
* Add boxzoom interaction (#1038)
* Add keyboard interaction (#1034)
* Faster `GeoJSONSource` `setData` without flickering (#973)

#### API Improvements

* Add Popup component (#325)
* Add layer API (#1022)
* Add filter API (#985)
* More efficient filter API (#1018)
* Accept plain old JS object for `addSource` (#1021)
* Reparse overscaled tiles

#### Bugfixes

* Fix `featuresAt` for LineStrings (#1006)
* Fix `tileSize` argument to `GeoJSON` worker (#987)
* Remove extraneous files from the npm package (#1024)
* Hide "improve map" link in print (#988)


## 0.6.0 (Feb 9 2015)

#### Bugfixes

* Add wrapped padding to sprite for repeating images (#972)
* Clear color buffers before rendering (#966)
* Make line-opacity work with line-image (#970)
* event.toElement fallback for Firefox (#932)
* skip duplicate vertices at ends of lines (#776)
* allow characters outside \w to be used in token
* Clear old tiles when new GeoJSON is loaded (#905)

#### Improvements

* Added `map.setPaintProperty()`, `map.getPaintProperty()`, `map.setLayoutProperty()`, and `map.getLayoutProperty()`.
* Switch to ESLint and more strict code rules (#957)
* Grab 2x raster tiles if retina (#754)
* Support for mapbox:// style URLs (#875)

#### Breaking

* Updated to mapbox-gl-style-spec v7.0.0 ([Changelog](https://github.com/mapbox/mapbox-gl-style-spec/blob/a2b0b561ce16015a1ef400dc870326b1b5255091/CHANGELOG.md)). Styles are
  now expected to be version 7. You can use the [gl-style-migrate](https://github.com/mapbox/mapbox-gl-style-lint#migrations)
  utility to update existing styles.
* HTTP_URL and HTTPS_URL config options must no longer include a `/v4` path prefix.
* `addClass`, `removeClass`, `setClasses`, `hasClass`, and `getClasses` are now methods
  on Map.
* `Style#cascade` is now private, pending a public style mutation API (#755).
* The format for `featuresAt` results changed. Instead of result-per-geometry-cross-layer,
  each result has a `layers` array with all layers that contain the feature. This avoids
  duplication of geometry and properties in the result set.


## 0.5.2 (Jan 07 2015)

#### Bugfixes

* Remove tiles for unused sources (#863)
* Fix fill pattern alignment

#### Improvements

* Add GeoJSONSource maxzoom option (#760)
* Return ref layers in featuresAt (#847)
* Return any extra layer keys provided in the stylesheet in featuresAt
* Faster protobuf parsing

## 0.5.1 (Dec 19 2014)

#### Bugfixes

* Fix race conditions with style loading/rendering
* Fix race conditions with setStyle
* Fix map.remove()
* Fix featuresAt properties

## 0.5.0 (Dec 17 2014)

#### Bugfixes

* Fix multiple calls to setStyle

#### Improvements

* `featuresAt` now returns additional information
* Complete style/source/tile event suite:
  style.load, style.error, style.change,
  source.add, source.remove, source.load, source.error, source.change,
  tile.add, tile.remove, tile.load, tile.error
* Vastly improved performance and correctness for GeoJSON sources
* Map#setStyle accepts a style URL
* Support {prefix} in tile URL templates
* Provide a source map with minified source

#### Breaking

* Results format for `featuresAt` changed

## 0.4.2 (Nov 14 2014)

#### Bugfixes

- Ensure only one easing is active at a time (#807)
- Don't require style to perform easings (#817)
- Fix raster tiles sometimes not showing up (#761)

#### Improvements

- Internet Explorer 11 support (experimental)

## 0.4.1 (Nov 10 2014)

#### Bugfixes

- Interpolate to the closest bearing when doing rotation animations (#818)

## 0.4.0 (Nov 4 2014)

#### Breaking

- Updated to mapbox-gl-style-spec v6.0.0 ([Changelog](https://github.com/mapbox/mapbox-gl-style-spec/blob/v6.0.0/CHANGELOG.md)). Styles are
  now expected to be version 6. You can use the [gl-style-migrate](https://github.com/mapbox/mapbox-gl-style-lint#migrations)
  utility to update existing styles.

## 0.3.2 (Oct 23 2014)

#### Bugfixes

- Fix worker initialization with deferred or async scripts

#### Improvements

- Added map.remove()
- CDN assets are now served with gzip compression

## 0.3.1 (Oct 06 2014)

#### Bugfixes

- Fixed iteration over arrays with for/in
- Made browserify deps non-dev (#752)

## 0.3.0 (Sep 23 2014)

#### Breaking

- Updated to mapbox-gl-style-spec v0.0.5 ([Changelog](https://github.com/mapbox/mapbox-gl-style-spec/blob/v0.0.5/CHANGELOG.md)). Styles are
  now expected to be version 5. You can use the [gl-style-migrate](https://github.com/mapbox/mapbox-gl-style-lint#migrations)
  utility to update existing styles.
- Removed support for composite layers for performance reasons. [#523](https://github.com/mapbox/mapbox-gl-js/issues/523#issuecomment-51731405)
- `raster-hue-rotate` units are now degrees.

### Improvements

- Added LatLng#wrap
- Added support for Mapbox fontstack API.
- Added support for remote, non-Mapbox TileJSON sources and inline TileJSON sources (#535, #698).
- Added support for `symbol-avoid-edges` property to allow labels to be placed across tile edges.
- Fixed mkdir issue on Windows (#674).
- Fixed drawing bevelled line joins without overlap.

#### Bugfixes

- Fixed performance when underzooming a layer's minzoom.
- Fixed `raster-opacity` for regular raster layers.
- Fixed various corner cases of easing functions.
- Do not modify original stylesheet (#728).
- Inherit video source from source (#699).
- Fixed interactivity for geojson layers.
- Stop dblclick on navigation so the map does not pan (#715).

## 0.2.2 (Aug 12 2014)

#### Breaking

- `map.setBearing()` no longer supports a second argument. Use `map.rotateTo` with an `offset` option and duration 0
if you need to rotate around a point other than the map center.

#### Improvements

- Improved `GeoJSONSource` to also accept URL as `data` option, eliminating a huge performance bottleneck in case of large GeoJSON files.
[#669](https://github.com/mapbox/mapbox-gl-js/issues/669) [#671](https://github.com/mapbox/mapbox-gl-js/issues/671)
- Switched to a different fill outlines rendering approach. [#668](https://github.com/mapbox/mapbox-gl-js/issues/668)
- Made the minified build 12% smaller gzipped (66 KB now).
- Added `around` option to `Map` `zoomTo`/`rotateTo`.
- Made the permalink hash more compact.
- Bevel linejoins no longer overlap and look much better when drawn with transparency.

#### Bugfixes

- Fixed the **broken minified build**. [#679](https://github.com/mapbox/mapbox-gl-js/issues/679)
- Fixed **blurry icons** rendering. [#666](https://github.com/mapbox/mapbox-gl-js/issues/666)
- Fixed `util.supports` WebGL detection producing false positives in some cases. [#677](https://github.com/mapbox/mapbox-gl-js/issues/677)
- Fixed invalid font configuration completely blocking tile rendering.  [#662](https://github.com/mapbox/mapbox-gl-js/issues/662)
- Fixed `Map` `project`/`unproject` to properly accept array-form values.
- Fixed sprite loading race condition. [#593](https://github.com/mapbox/mapbox-gl-js/issues/593)
- Fixed `GeoJSONSource` `setData` not updating the map until zoomed or panned. [#676](https://github.com/mapbox/mapbox-gl-js/issues/676)

## 0.2.1 (Aug 8 2014)

#### Breaking

- Changed `Navigation` control signature: now it doesn't need `map` in constructor
and gets added with `map.addControl(nav)` or `nav.addTo(map)`.
- Updated CSS classes to have consistent naming prefixed with `mapboxgl-`.

#### Improvements

- Added attribution control (present by default, disable by passing `attributionControl: false` in options).
- Added rotation by dragging the compass control.
- Added grabbing cursors for the map by default.
- Added `util.inherit` and `util.debounce` functions.
- Changed the default debug page style to OSM Bright.
- Token replacements now support dashes.
- Improved navigation control design.

#### Bugfixes

- Fixed compass control to rotate its icon with the map.
- Fixed navigation control cursors.
- Fixed inertia going to the wrong direction in a rotated map.
- Fixed inertia race condition where error was sometimes throwed after erratic panning/zooming.


## 0.2.0 (Aug 6 2014)

- First public release.
