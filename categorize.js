const categories = {
  recyclable: {
    disposal: "Place in the recycling bin.",
  },
  nonRecyclable: {
    disposal: "Place in the general waste bin.",
  },
  hazardous: {
    disposal: "Dispose of at a hazardous waste facility.",
  },
  compostable: {
    disposal: "Place in the compost bin.",
  },
  electronic: {
    disposal: "Take to an e-waste recycling center.",
  },
};

// Priority-based waste classification
const higher_priority = [
  "bottle", "can", "paper", "cardboard", "glass", "metal", "plastic", "battery", "chemical", "paint", "oil", "solvent", "thermometer", "fork", "knife", "spoon"
];
const medium_priority = [
  "phone", "laptop", "computer", "tv", "monitor", "printer", "styrofoam", "ceramic", "light bulb", "cigarette", "diaper", "toothbrush", "scissors", "teddy bear", "wine glass"
];
const lower_priority = ["apple", "banana", "vegetable", "fruit", "leaves", "grass"];

// Function to generate a random credit score within a given range
function getRandomCredit(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let db;

// Open or create the database
const dbRequest = indexedDB.open("WasteDB", 1);

dbRequest.onupgradeneeded = (event) => {
  db = event.target.result;
  // Create an object store named "waste" with auto-incrementing keys
  if (!db.objectStoreNames.contains("waste")) {
    db.createObjectStore("waste", { keyPath: "id", autoIncrement: true });
  }
};

dbRequest.onsuccess = () => {
  db = dbRequest.result;
  console.log("Database ready");
  loadResults(); // Load past results when the database is ready
};

dbRequest.onerror = (event) => {
  console.error("Error opening database:", event.target.error);
};

// Save result to the database
function saveResult(category, description) {
  if (!db) {
    console.error("Database not ready.");
    return;
  }

  const transaction = db.transaction("waste", "readwrite");
  const store = transaction.objectStore("waste");

  // Add the result to the database
  const request = store.add({
    category,
    description,
    timestamp: new Date(),
  });

  request.onsuccess = () => {
    console.log("Result saved to database");
  };

  request.onerror = (event) => {
    console.error("Error saving result:", event.target.error);
  };
}

// Load past results from the database
function loadResults() {
  if (!db) {
    console.error("Database not ready.");
    return;
  }

  const transaction = db.transaction("waste", "readonly");
  const store = transaction.objectStore("waste");
  const request = store.getAll();

  request.onsuccess = () => {
    const resultsContainer = document.getElementById("results");
    resultsContainer.innerHTML = "<h2>Past Classifications</h2>";

    request.result.forEach((entry) => {
      resultsContainer.innerHTML += `
        <div class="category">
          <strong>${entry.category}</strong> - ${entry.description}
          <small>${new Date(entry.timestamp).toLocaleString()}</small>
        </div>
      `;
    });
  };

  request.onerror = (event) => {
    console.error("Error loading results:", event.target.error);
  };
}

// Load past results when the page loads
document.addEventListener("DOMContentLoaded", () => {
  loadResults();
});

// Process detections and save results
function processDetections(detections) {
  const resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = ""; // Clear previous results

  detections.forEach((item) => {
    const category = classifyObject(item.class);
    const disposal = categories[category]?.disposal || "Unknown disposal method.";

    let priority = "Unknown";
    let creditScore = 0;

    if (higher_priority.includes(item.class)) {
      priority = "High Priority";
      creditScore = getRandomCredit(80, 100);
    } else if (medium_priority.includes(item.class)) {
      priority = "Medium Priority";
      creditScore = getRandomCredit(50, 79);
    } else if (lower_priority.includes(item.class)) {
      priority = "Low Priority";
      creditScore = getRandomCredit(10, 49);
    }
    alert("Congratulations! You have successfully earned " + creditScore + " points for recycling " + item.class + "!");

    // Display structured results
    const section = document.createElement("div");
    section.className = "category";
    section.innerHTML = `
      <h2>${item.class}</h2>
      <p><strong>Category:</strong> ${category}</p>
      <p><strong>Priority:</strong> ${priority}</p>
      <p><strong>Credit Score:</strong> ${creditScore}</p>
      <p><strong>Disposal Instructions:</strong> ${disposal}</p>
    `;
    resultsContainer.appendChild(section);

    // Save result to the database
    saveResult(category, `${item.class} - ${disposal}`);
  });
}

// Classify objects into waste categories
function classifyObject(objectName) {
  objectName = objectName.toLowerCase();

  const recyclableItems = ["bottle", "can", "paper", "cardboard", "glass", "metal", "plastic", "fork", "knife", "spoon"];
  const hazardousItems = ["battery", "chemical", "paint", "oil", "solvent", "thermometer"];
  const compostableItems = ["apple", "banana", "vegetable", "fruit", "leaves", "grass"];
  const electronicItems = ["phone", "laptop", "computer", "tv", "monitor", "printer"];
  const nonRecyclableItems = ["styrofoam", "ceramic", "light bulb", "cigarette", "diaper", "toothbrush", "scissors", "teddy bear", "wine glass"];

  if (recyclableItems.includes(objectName)) return "recyclable";
  if (hazardousItems.includes(objectName)) return "hazardous";
  if (compostableItems.includes(objectName)) return "compostable";
  if (electronicItems.includes(objectName)) return "electronic";
  if (nonRecyclableItems.includes(objectName)) return "nonRecyclable";
  return "nonRecyclable";
}

function clear_content() {
  const my_id = document.getElementById("results");
  my_id.innerHTML = ""; // Clear the displayed results

  if (!db) {
    console.error("Database not ready.");
    return;
  }

  // Clear the IndexedDB entries
  const transaction = db.transaction("waste", "readwrite");
  const store = transaction.objectStore("waste");
  const request = store.clear();

  request.onsuccess = () => {
    console.log("All stored classifications have been deleted.");
  };

  request.onerror = (event) => {
    console.error("Error clearing database:", event.target.error);
  };
}
