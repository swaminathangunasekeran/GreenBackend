/* Created By Swami on 18 Nov 2017 , this is an constan file where all constant are store */

//export const mongoose = require('mongoose');
//export const languages = ['java','python','nodejs','C','C++']
//export const compile_run = require('compile-run');
const pubTopics = ['technology','politics','travel',
'religion','byyoung','health','history','stories','science','rationalism','others','food']
//const pubTopics = ['technology','politics','travel'];
const pubName = "thudup";
const access_keyid  = 'AKIAI4UKPW34RSLHAC7Q';
const secretAccessKey = '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';
const region =  "ap-southeast-1";
const bucket_name = "thudup-image-store"
module.exports = {
    pubTopics: pubTopics,
    pubName:pubName,
    access_keyid:access_keyid,
    secretAccessKey : secretAccessKey,
    region :  region,
    bucket_name : bucket_name
};
