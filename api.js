'use strict';

const fs = require('fs');
const path = require('path');
const aws = require('aws-sdk');
const request = require('request-promise-native');
const Promise = require('bluebird');
const Redis = require('./clients/redis');

const BUCKET = process.env.BUCKET;
const s3 = new aws.S3({ apiVersion: "2006-03-01" });

/**
 * @param event
 * @returns object
 */
module.exports.handler = async (event) => {

    let body;
    try {
        body = JSON.parse(event.body);
    } catch (e) {
        let headers = { 'Content-Type': 'application/json' };
        return { statusCode: 400, body: JSON.stringify({ code: 400, detail: 'error decoding json body.' }), headers }
    }

    // Execute "download" function on all the urls that are sent in "body"
    let result = await Promise.map(body, download, { concurrency: 100 });
    let successes = result.filter(item => item.error !== true);
    let errors = result.filter(item => item.error === true);
    let responsePayload = {
        totalSucceeded: successes.length,
        totalErrors: errors.length,
        errors
    };

    let headers = { 'Content-Type': 'application/json' };
    return { statusCode: 200, body: JSON.stringify(responsePayload), headers };
};

async function download(payload) {
    let { url, destination } = payload;

    try {
        let binaryContent = await request({ method: 'GET', uri: url, encoding: null });

        // Write to disk
        // let filePath = path.join('/tmp', path.basename(destination));
        // fs.writeFileSync(filePath, binaryContent);

        // Upload to S3
        await s3.putObject({ Bucket: BUCKET, Key: destination, Body: binaryContent, ContentType: 'image/jpeg' }).promise();

        return { error: false, url, destination };
    } catch (e) {
        // Log if needed
        console.error(e);

        // Throw the exception if needed
        // throw e;

        return { error: true, url, destination, errorMessage: e.toString() };
    }
}