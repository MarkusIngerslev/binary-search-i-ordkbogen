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
        // console.log(min, max);
    });

    document.querySelector("#search-button").addEventListener("click", async () => {
        const search = document.querySelector("#search-input").value;
        // console.log(search);
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
    cleanUp();

    while (min <= right) {
        let middle = Math.floor((left + right) / 2);
        iterations++;
        document.querySelector(
            "#search-attempts"
        ).textContent = `Server requests: ${iterations} - totalt time: unknown`;

        const entry = await getEntryAt(middle);
        // console.log(entry);

        const comp = search.localeCompare(entry.inflected);

        if (comp === 0) {
            displayResult(entry, iterations, startTime);
            // console.log(entry, iterations, startTime);
            return;
        } else if (comp > 0) {
            left = middle + 1;
        } else {
            right = middle - 1;
        }

        // Hvis left bliver større end right, betyder det, at ordet ikke findes.
        if (left > right) {
            // console.log("Ordet blev ikke fundet efter " + iterations + " iterationer.");
            displayNotFound(search, iterations, startTime);
            return;
        }
    }

    // Hvis vi når hertil, er ordet ikke fundet
    // console.log("Ordet blev ikke fundet.");
    displayNotFound(search, iterations, startTime);
}

// Funktion til at håndtere resultater, når ordet ikke findes
function displayNotFound(search, iterations, startTime) {
    const endTime = performance.now();
    const timeTaken = endTime - startTime;
    // console.log(`Ordet '${search}' blev ikke fundet efter ${iterations} iterationer på ${timeTaken.toFixed(2)} ms.`);

    document.querySelector(
        "#search-attempts"
    ).textContent = `Server requests: ${iterations} - totalt tim: ${timeTaken.toFixed(2)} ms`;

    document.querySelector("#search-title").textContent = "ikke fudnet";
    document.querySelector(
        "#search-word-not-found"
    ).textContent = `Ordet '${search}' blev ikke fundet efter ${iterations}`;
}

function displayResult(entry, iterations, startTime) {
    const endTime = performance.now();
    const timeTaken = endTime - startTime;

    // console.log(`Ordet '${entry.inflected}' blev fundet efter ${iterations} iterationer på ${timeTaken.toFixed(2)} ms.`);

    document.querySelector(
        "#search-attempts"
    ).textContent = `Server requests: ${iterations} - totalt time: ${timeTaken.toFixed(2)} ms`;

    const html = /*html */ `
        <li>Bøjningsform</li>
        <ul>
            <li>${entry.inflected}</li>    
        </ul>

        <li>Opslagsord</li>
        <ul>
            <li>${entry.headword}</li>
        </ul>
        
        <li>Homograf nr.</li>
        <ul>
            <li>${entry.homograph || "N/A"}</li>
        </ul>
        
        <li>Ordklasse</li>
        <ul>
            <li>${entry.partofspeech}</li>
        </ul>
        
        <li>id</li>
        <ul>
            <li>${entry.id}</li>
        </ul>
    `;
    document.querySelector("#search-result").innerHTML = html;
}

function cleanUp() {
    document.querySelector("#search-title").textContent = "";
    document.querySelector("#search-word-not-found").textContent = "";
    document.querySelector("#search-result").textContent = "";
}
