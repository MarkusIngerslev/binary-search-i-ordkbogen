"use strict";

window.addEventListener("load", start);

// Global variables
const endpoint = "http://localhost:8081/ordbogen";
let totaltEntries = 0;
let min;
let max;

function start() {
    console.log("JavaScript is live! 🎉🎉");
    getSizes().then((json) => {
        console.log(json);
    });
    getEntryAt(0).then((entry) => {
        console.log(entry);
    });
}

// Fetch data from the server
async function getSizes() {
    const json = await fetch(endpoint).then((res) => res.json());
    return json;
}

// Fetch
async function getEntryAt(index) {
    const entry = await fetch(`${endpoint}/${index}`).then((resp) => resp.json());
    return entry;
}
