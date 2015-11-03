/* jshint -W089 */

// for naver api
var request = require('request');
var async = require('async');
var Promise = require('bluebird');
var parseString = require('xml2js').parseString;
var striptags = require('striptags');
var API_KEY = 'f0daea572e7f33f8c9c48a281fac5683';
var apiHost = 'http://openapi.naver.com/';

module.exports = getProducts;

function getProducts(req, res, next) {
    var options = {
        key: API_KEY,
        target: 'shop',
        start: req.query.skip || 1,
        display: req.query.limit || 30,
        query: req.params.word,
    };

    request
        .get({
            url: apiHost + 'search',
            qs: options,
            encoding: 'utf-8',
        }, function (error, res2, body) {
            if (error) {
                return res.status(400).send(error);
            }

            parseString(body, function (error, result) {
                if (error) {
                    return res.status(400).send(error);
                }

                if (result.error) {
                    return res.status(400).send(result.error);
                }

                var items = result.rss.channel[0].item;

                if (items) {
                    items.forEach(function (item, idx) {
                        for (var i in item) {
                            items[idx][i] = item[i][0];
                        }
                    });

                    items.forEach(function (item, idx) {
                        items[idx]['title'] = striptags(items[idx]['title']);
                    });
                }

                return res.status(200).send(items || []);
            });
        });
}
