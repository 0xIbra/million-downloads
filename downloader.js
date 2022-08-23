'use strict';

const fs = require('fs');
const path = require('path');
// const aws = require('aws-sdk');
const request = require('request-promise-native');
const Promise = require('bluebird');
const Redis = require('./clients/redis');

// const BUCKET = process.env.BUCKET;
// const s3 = new aws.S3({ apiVersion: "2006-03-01" });

/**
 *
 * @param event
 * @returns void
 */
module.exports.handler = async (event) => {
    // event: [{ url: 'https://cdn.provider.com/some-image.jpg', destination: '/tmp/some-image.jpg' }, ...]

    // Execute "download" function on all the urls that are sent in "event"
    await Promise.map(event, download, { concurrency: 100 });

    // I used redis to track the progress to measure the performance
    const redis = new Redis({
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD
    });
    await redis.connect();
    let key = 'million_downloads';
    await redis.incrBy(key, event.length);
};

async function download(payload) {
    let { url, destination } = payload;

    try {
        let content = await request({ method: 'GET', uri: url, encoding: null });
        let Body = content;

        let filePath = path.join('/tmp', path.basename(destination));
        fs.writeFileSync(filePath, Body);

        // await s3.putObject({ Bucket: BUCKET, Key: destination, Body, ContentType: 'image/jpeg' }).promise();
    } catch (e) {
        throw e;
    }
}