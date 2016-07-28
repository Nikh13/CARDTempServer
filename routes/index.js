var express = require('express');
var router = express.Router();
var request = require("request");
var PAGE_OFFSET = 10;

router.get('/auth', function (req, res) {
    var options = {
        method: 'POST',
        url: 'https://10.76.35.29:8000/auth/oauth',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'postman-token': '84b99d7a-6889-b693-7221-c9f81a337a49',
            'cache-control': 'no-cache'
        },
        form: {
            grant_type: 'password',
            username: 'admin',
            password: 'Hitachi1',
            scope: '*',
            client_secret: 'hci_client',
            client_id: 'hci_client'
        }
    };

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    request(options, function (error, response, body) {
        if (error) throw new Error("Error Body: " + error + " Response: " + response);
        res.header('Access-Control-Allow-Origin', '*');
        res.json(JSON.parse(body));
    });

});

router.post('/query', function (req, res) {
    var query = req.body.queryString;
    var auth = req.body.authCode;
    var pageNumber = req.body.pageNo;

    console.log("Auth: " + auth);

    var options = {
        method: 'POST',
        url: 'https://10.76.35.29:8888/api/search/query',
        headers: {
            'cache-control': 'no-cache',
            authorization: 'Bearer ' + auth,
            accept: 'application/json',
            'content-type': 'application/json'
        },
        body: {
            indexName: 'insights_index_copy',
            queryString: query,
            offset: pageNumber * PAGE_OFFSET | 0,
            itemsToReturn: PAGE_OFFSET,
            facetRequests: [{
                fieldName: 'Content_Type',
                minCount: -1,
                maxCount: -1,
                displayName: 'Content_Type',
                type: 'string'
            },
                {
                    fieldName: 'HCI_dataSourceName',
                    minCount: -1,
                    maxCount: -1,
                    displayName: 'HCI_dataSourceName',
                    type: 'string'
                }],
            sortFields: [],
            filterQueries: []
        },
        json: true
    };
    console.log("Option: " + options.body.offset);
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    res.header('Access-Control-Allow-Origin', '*');

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        body.offset = PAGE_OFFSET;
        res.json(body);
    });

});


router.post('/suggestions', function (req, res) {
    var query = req.body.queryString;
    var auth = req.body.authCode;

    console.log("Auth: " + auth);

    var options = {
        method: 'POST',
        url: 'https://10.76.35.29:8888/api/search/suggest',
        headers: {
            'cache-control': 'no-cache',
            authorization: 'Bearer ' + auth,
            accept: 'application/json',
            'content-type': 'application/json'
        },
        body: {
            "indexName": "insights_index_copy",
            "queryString": query
        },
        json: true
    };
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    res.header('Access-Control-Allow-Origin', '*');

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        res.json(body);
    });

});

module.exports = router;
