'use strict';

var test = require('prova');
var Map = require('../../../js/ui/map');
var Style = require('../../../js/style/style');
var LngLat = require('../../../js/geo/lng_lat');

test('Map', function(t) {
    function createMap() {
        return new Map({
            container: {
                offsetWidth: 200,
                offsetHeight: 200,
                classList: {
                    add: function() {}
                }
            },
            interactive: false,
            attributionControl: false
        });
    }

    t.test('constructor', function(t) {
        var map = createMap();
        t.ok(map.getContainer());
        t.end();
    });

    t.test('#setStyle', function(t) {
        t.test('returns self', function(t) {
            var map = createMap(),
                style = {
                    version: 8,
                    sources: {},
                    layers: []
                };
            t.equal(map.setStyle(style), map);
            t.end();
        });

        t.test('sets up event forwarding', function(t) {
            var map = createMap(),
                style = new Style({
                    version: 8,
                    sources: {},
                    layers: []
                });

            function styleEvent(e) {
                t.equal(e.style, style);
            }

            function sourceEvent(e) {
                t.equal(e.style, style);
            }

            function tileEvent(e) {
                t.equal(e.style, style);
            }

            map.on('style.load',    styleEvent);
            map.on('style.error',   styleEvent);
            map.on('style.change',  styleEvent);
            map.on('source.load',   sourceEvent);
            map.on('source.error',  sourceEvent);
            map.on('source.change', sourceEvent);
            map.on('tile.add',      tileEvent);
            map.on('tile.load',     tileEvent);
            map.on('tile.error',    tileEvent);
            map.on('tile.remove',   tileEvent);

            t.plan(10);
            map.setStyle(style); // Fires load
            style.fire('error');
            style.fire('change');
            style.fire('source.load');
            style.fire('source.error');
            style.fire('source.change');
            style.fire('tile.add');
            style.fire('tile.load');
            style.fire('tile.error');
            style.fire('tile.remove');
        });

        t.test('can be called more than once', function(t) {
            var map = createMap();

            map.setStyle({version: 8, sources: {}, layers: []});
            map.setStyle({version: 8, sources: {}, layers: []});

            t.end();
        });
    });

    t.test('#resize', function(t) {
        t.test('sets width and height from container offsets', function(t) {
            var map = createMap(),
                container = map.getContainer();

            container.offsetWidth = 250;
            container.offsetHeight = 250;
            map.resize();

            t.equal(map.transform.width, 250);
            t.equal(map.transform.height, 250);

            t.end();
        });

        t.test('fires movestart, move, resize, and moveend events', function(t) {
            var map = createMap(),
                events = [];

            ['movestart', 'move', 'resize', 'moveend'].forEach(function (event) {
                map.on(event, function(e) {
                    events.push(e.type);
                });
            });

            map.resize();
            t.deepEqual(events, ['movestart', 'move', 'resize', 'moveend']);

            t.end();
        });
    });

    t.test('#getBounds', function(t) {
        var map = createMap();
        t.deepEqual(parseFloat(map.getBounds().getCenter().lng.toFixed(10)), 0, 'getBounds');
        t.deepEqual(parseFloat(map.getBounds().getCenter().lat.toFixed(10)), 0, 'getBounds');
        t.end();
    });

    t.test('#remove', function(t) {
        var map = createMap();
        t.equal(map.remove(), map);
        t.end();
    });

    t.test('#addControl', function(t) {
        var map = createMap();
        var control = {
            addTo: function(_) {
                t.equal(map, _, 'addTo() called with map');
                t.end();
            }
        };
        map.addControl(control);
    });

    t.test('#addClass', function(t) {
        var map = createMap();
        map.addClass('night');
        t.ok(map.hasClass('night'));
        t.end();
    });

    t.test('#removeClass', function(t) {
        var map = createMap();
        map.addClass('night');
        map.removeClass('night');
        t.ok(!map.hasClass('night'));
        t.end();
    });

    t.test('#setClasses', function(t) {
        var map = createMap();
        map.addClass('night');
        map.setClasses([]);
        t.ok(!map.hasClass('night'));

        map.setClasses(['night']);
        t.ok(map.hasClass('night'));
        t.end();
    });

    t.test('#getClasses', function(t) {
        var map = createMap();
        map.addClass('night');
        t.deepEqual(map.getClasses(), ['night']);
        t.end();
    });

    t.test('#project', function(t) {
        var map = createMap();
        t.deepEqual(map.project([0, 0]), { x: 100, y: 100 });
        t.end();
    });

    t.test('#unproject', function(t) {
        var map = createMap();
        t.deepEqual(map.unproject([100, 100]), { lng: 0, lat: 0 });
        t.end();
    });

    t.test('#batch', function(t) {
        var map = createMap();
        map.setStyle({
            version: 8,
            sources: {},
            layers: []
        });
        map.on('style.load', function() {
            map.batch(function(batch) {
                batch.addLayer({ id: 'background', type: 'background' });
            });
            t.ok(map.style.getLayer('background'), 'has background');

            t.end();
        });
    });


    t.test('#featuresAt', function(t) {
        var map = createMap();
        map.setStyle({
            "version": 8,
            "sources": {},
            "layers": []
        });

        map.on('style.load', function() {
            var callback = function () {};
            var opts = {};

            t.test('normal coords', function(t) {
                map.style.featuresAt = function (coords, o, cb) {
                    t.deepEqual(coords, { column: 0.5, row: 0.5, zoom: 0 });
                    t.equal(o, opts);
                    t.equal(cb, callback);

                    t.end();
                };

                map.featuresAt(map.project(new LngLat(0, 0)), opts, callback);
            });

            t.test('wraps coords', function(t) {
                map.style.featuresAt = function (coords, o, cb) {
                    // avoid floating point issues
                    t.equal(parseFloat(coords.column.toFixed(4)), 0.5);
                    t.equal(coords.row, 0.5);
                    t.equal(coords.zoom, 0);

                    t.equal(o, opts);
                    t.equal(cb, callback);

                    t.end();
                };

                map.featuresAt(map.project(new LngLat(360, 0)), opts, callback);
            });

            t.end();
        });
    });

    t.end();
});
