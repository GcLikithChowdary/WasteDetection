// app.js - Main JavaScript file to handle UI interactions & AI processing

import { handleImageProcessing } from "./tensorflow.js";
import { categorizeWaste } from "./categorize.js";

document.getElementById("imageUpload").addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Process image using TensorFlow.js
    const detectedItems = await handleImageProcessing(file);

    // Display results
    displayResults(detectedItems);
});

function displayResults(detections) {
    const resultsContainer = document.getElementById("results");
    resultsContainer.innerHTML = "";

    detections.forEach((item) => {
        const { name, bbox } = item;
        const { category, creditScore, disposal } = categorizeWaste(name);

        // Create result container
        const section = document.createElement("div");
        section.className = "category";
        section.innerHTML = `
            <h2>${name}</h2>
            <p><strong>Category:</strong> ${category}</p>
            <p><strong>Credit Score:</strong> ${creditScore}</p>
            <p><strong>Disposal Instructions:</strong> ${disposal}</p>
        `;
        resultsContainer.appendChild(section);
    });
}
