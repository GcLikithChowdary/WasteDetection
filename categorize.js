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
const higher_priority = ["bottle", "can", "paper", "cardboard", "glass", "metal", "plastic", "battery", "chemical", "paint", "oil", "solvent", "thermometer"];
const medium_priority = ["phone", "laptop", "computer", "tv", "monitor", "printer", "styrofoam", "ceramic", "light bulb", "cigarette", "diaper"];
const lower_priority = ["apple", "banana", "vegetable", "fruit", "leaves", "grass"];

// Function to generate a random credit score within a given range
function getRandomCredit(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function processDetections(detections) {
  const resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = ''; // Clear previous results

  detections.forEach(item => {
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

    // Display structured results
    const section = document.createElement('div');
    section.className = 'category';
    section.innerHTML = `
      <h2>${item.class}</h2>
      <p><strong>Category:</strong> ${category}</p>
      <p><strong>Priority:</strong> ${priority}</p>
      <p><strong>Credit Score:</strong> ${creditScore}</p>
      <p><strong>Disposal Instructions:</strong> ${disposal}</p>
    `;
    resultsContainer.appendChild(section);
  });
}

function classifyObject(objectName) {
  objectName = objectName.toLowerCase();

  const recyclableItems = ["bottle", "can", "paper", "cardboard", "glass", "metal", "plastic"];
  const hazardousItems = ["battery", "chemical", "paint", "oil", "solvent", "thermometer"];
  const compostableItems = ["apple", "banana", "vegetable", "fruit", "leaves", "grass"];
  const electronicItems = ["phone", "laptop", "computer", "tv", "monitor", "printer"];
  const nonRecyclableItems = ["styrofoam", "ceramic", "light bulb", "cigarette", "diaper"];

  if (recyclableItems.includes(objectName)) return "recyclable";
  if (hazardousItems.includes(objectName)) return "hazardous";
  if (compostableItems.includes(objectName)) return "compostable";
  if (electronicItems.includes(objectName)) return "electronic";
  if (nonRecyclableItems.includes(objectName)) return "nonRecyclable";
  return "nonRecyclable";
}