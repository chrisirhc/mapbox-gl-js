'use strict';

var config = require('./config');
var browser = require('./browser');

function normalizeURL(url, pathPrefix, accessToken) {
    accessToken = accessToken || config.ACCESS_TOKEN;

    if (!accessToken && config.REQUIRE_ACCESS_TOKEN) {
        throw new Error('An API access token is required to use Mapbox GL. ' +
            'See https://www.mapbox.com/developers/api/#access-tokens');
    }

    url = url.replace(/^mapbox:\/\//, config.API_URL + pathPrefix);
    url += url.indexOf('?') !== -1 ? '&access_token=' : '?access_token=';

    if (config.REQUIRE_ACCESS_TOKEN) {
        if (accessToken[0] === 's') {
            throw new Error('Use a public access token (pk.*) with Mapbox GL JS, not a secret access token (sk.*). ' +
                'See https://www.mapbox.com/developers/api/#access-tokens');
        }

        url += accessToken;
    }

    return url;
}

module.exports.normalizeStyleURL = function(url, accessToken) {
    var user = url.match(/^mapbox:\/\/([^.]+)/);
    if (!user)
        return url;

    return normalizeURL(url, '/styles/v1/' + user[1] + '/', accessToken);
};

module.exports.normalizeSourceURL = function(url, accessToken) {
    if (!url.match(/^mapbox:\/\//))
        return url;

    // TileJSON requests need a secure flag appended to their URLs so
    // that the server knows to send SSL-ified resource references.
    return normalizeURL(url + '.json', '/v4/', accessToken) + '&secure';
};

module.exports.normalizeGlyphsURL = function(url, accessToken) {
    if (!url.match(/^mapbox:\/\//))
        return url;

    var user = url.split('/')[3];
    return normalizeURL('mapbox://' + user + '/{fontstack}/{range}.pbf', '/fonts/v1/', accessToken);
};

module.exports.normalizeTileURL = function(url, sourceUrl) {
    if (!sourceUrl || !sourceUrl.match(/^mapbox:\/\//))
        return url;
    return url.replace(/\.((?:png|jpg)\d*)(?=$|\?)/, browser.devicePixelRatio >= 2 ? '@2x.$1' : '.$1');
};
