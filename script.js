"use strict";

window.addEventListener("load", start);

// Global variables
const endpoint = "http://localhost:8081/ordbogen";
let min;
let max;

function start() {
    console.log("JavaScript is live! 🎉🎉");

    getSizes().then((data) => {
        min = data.min;
        max = data.max;
        console.log(min, max);
    });

    document.querySelector("#search-button").addEventListener("click", async () => {
        const search = document.querySelector("#search-input").value;
        console.log(search);
        await binarySearch(search);
    });
}

// Fetch data from the server
async function getSizes() {
    const json = await fetch(endpoint).then((res) => res.json());
    return json;
}

// Fetch an entry by index from the server
async function getEntryAt(index) {
    const entry = await fetch(`${endpoint}/${index}`).then((resp) => resp.json());
    return entry;
}

async function binarySearch(search) {
    // Benytter to andre variabler, da min og max er for hele ordbogen
    let left = min;
    let right = max;
    let iterations = 0;
    const startTime = performance.now(); // Start tidtagning

    while (min <= right) {
        let middle = Math.floor((left + right) / 2);
        iterations++;

        const entry = await getEntryAt(middle);
        console.log(entry);

        const comp = search.localeCompare(entry.inflected);

        if (comp === 0) {
            //displayResult(entry, iterations, startTime);
            console.log(entry, iterations, startTime);
            return;
        } else if (comp > 0) {
            left = middle + 1;
        } else {
            right = middle - 1;
        }

        // Hvis left bliver større end right, betyder det, at ordet ikke findes.
        if (left > right) {
            console.log("Ordet blev ikke fundet efter " + iterations + " iterationer.");
            displayNotFound(search, iterations, startTime);
            return;
        }
    }

    // Hvis vi når hertil, er ordet ikke fundet
    console.log("Ordet blev ikke fundet.");
    displayNotFound(search, iterations, startTime);
}

// Funktion til at håndtere resultater, når ordet ikke findes
function displayNotFound(search, iterations, startTime) {
    const endTime = performance.now();
    const timeTaken = endTime - startTime;
    console.log(`Ordet '${search}' blev ikke fundet efter ${iterations} iterationer på ${timeTaken.toFixed(2)} ms.`);
    // Eventuel kode til at vise en fejlbesked på siden kan tilføjes her
}

function displayResult(entry, iterations, startTime) {
    console.log();
}
