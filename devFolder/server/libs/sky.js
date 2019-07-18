/*jshint node: true */
(function () {
    'use strict';

    var rq;

    rq = require('request-promise');


    /**
     * Wrap all GET proxy calls.
     * @private
     * @name get
     * @param {Object} request
     * @param {String} endpoint
     * @param {Function} callback
     */
    function get(request, endpoint, callback) {
        return proxy(request, 'GET', endpoint, '', callback);
    }


    /**
     * Gets the requested constituent
     * @name getConstituent
     * @param {Object} request
     * @param {string} constituentId Id of the constituent to retrieve
     * @param {Function} callback
     */
    function getConstituent(request, constituentId, callback) {
        get(request, 'constituents/' + constituentId, callback);
    }


    /**
     * Gets the requested constituent phone numbers
     * @name getPhone
     * @param {Object} request
     * @param {string} constituentId Id of the constituent to retrieve
     * @param {Function} callback
     */
    function getPhone(request, constituentId, callback) {
        get(request, 'constituents/' + constituentId + '/phones', callback);
    }


    /**
     * Gets the requested constituent
     * @name getConstituentCodes
     * @param {Object} request
     * @param {string} offset of the constituent codes to retrieve
     * @param {Function} callback
     */
    function getConstituentCodes(request, offset, callback) {
        get(request, 'constituents/constituentcodes?include_inactive=true&limit=5000&offset=' + offset, callback);
    }


    /**
     * Gets the requested constituent's relationships
     * @name getConstituentRelationships
     * @param {Object} request
     * @param {string} constituentId Id of the constituent to retrieve
     * @param {Function} callback
     */
    function getConstituentRelationships(request, constituentId, callback) {
        get(request, 'constituents/' + constituentId + '/relationships', callback);
    }


    /**
     * Searches for a constituent.
     * @name getConstituent
     * @param {Object} request
     * @param {string} name Name of the constituent to search for.
     * @param {Function} callback
     */
    function getConstituentSearch(request, name, callback) {
        get(request, 'constituents/search?search_text=' + name, callback);
    }


    /**
     * Wrap all POST proxy calls.
     * @private
     * @name get
     * @param {Object} request
     * @param {String} endpoint
     * @param {Function} callback
     */
    function post(request, endpoint, body, callback) {
        return proxy(request, 'POST', endpoint, body, callback);
    }


    /**
     * Posts a note to the specified constituent
     * @name postNotes
     * @param {Object} request
     * @param {string} constituentId Id of the constituent to retrieve
     * @param {Function} callback
     */
    function postNotes(request, constituentId, body, callback) {
        post(request, 'constituents/' + constituentId + '/notes', body, callback);
    }


    /**
     * Wrap all POST proxy calls.
     * @private
     * @name get
     * @param {Object} request
     * @param {String} endpoint
     * @param {Function} callback
     */
    function patch(request, endpoint, body, callback) {
        return proxy(request, 'PATCH', endpoint, body, callback);
    }


    /**
     * Gets the requested constituent
     * @name patchConstituent
     * @param {Object} request
     * @param {string} constituentId Id of the constituent to retrieve
     * @param {Function} callback
     */
    function patchConstituentFirstName(request, constituentId, body, callback) {
        patch(request, 'constituents/' + constituentId, body, callback);
    }


    /**
     * Proxy method to the RENXT api.
     * Validates the session before initiating request.
     * @private
     * @name getProxy
     * @param {Object} request
     * @param {string} method
     * @param {string} endpoint
     * @param {Function} callback
     */
    function proxy(request, method, endpoint, body, callback) {
        var options;

        options = {
            json: true,
            method: method,
            body: body,
            url: 'https://api.sky.blackbaud.com/constituent/v1/' + endpoint,
            headers: {
                'bb-api-subscription-key': process.env.AUTH_SUBSCRIPTION_KEY,
                'Authorization': 'Bearer ' + request.session.ticket.access_token
            },
            timeout: 1200000
        };

        rq(options).then(callback).catch(function (err) {
            console.log('Proxy Error: ', err);
        });
    }


    /**
     * Class which lightly wraps a few of SKY API endpoints.
     * @constructor
     * @returns {Object}
     *  {@link getConstituent}
     */
    module.exports = {
        getConstituent: getConstituent,
        getPhone: getPhone,
        getConstituentCodes: getConstituentCodes,
        getConstituentRelationships: getConstituentRelationships,
        getConstituentSearch: getConstituentSearch,
        postNotes: postNotes,
        patchConstituentFirstName: patchConstituentFirstName
    };
}());
