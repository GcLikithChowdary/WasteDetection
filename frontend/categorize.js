// Define waste categories and their disposal instructions
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

// Define material-based mappings for better classification
const materialMapping = {
  "bottle": "plastic bottle",
  "can": "aluminum can",
  "paper": "paper sheet",
  "cardboard": "cardboard box",
  "glass": "glass bottle",
  "metal": "metal can",
  "plastic": "plastic container",
  "cup": "plastic cup",
  "box": "cardboard box",
  "battery": "battery",
  "chemical": "chemical waste",
  "paint": "paint can",
  "oil": "oil container",
  "solvent": "solvent bottle",
  "thermometer": "mercury thermometer",
  "apple": "apple core",
  "banana": "banana peel",
  "vegetable": "vegetable waste",
  "fruit": "fruit scraps",
  "leaves": "dry leaves",
  "grass": "grass clippings",
  "phone": "mobile phone",
  "laptop": "laptop",
  "computer": "computer",
  "tv": "television",
  "monitor": "monitor screen",
  "printer": "printer",
  "styrofoam": "styrofoam",
  "ceramic": "ceramic plate",
  "light bulb": "light bulb",
  "cigarette": "cigarette butt",
  "diaper": "used diaper"
};

// Priority classification with corresponding credit score ranges
const higher_priority = [
  "battery", "chemical waste", "paint can", "oil container", "solvent bottle", "mercury thermometer",
  "mobile phone", "laptop", "computer", "television", "monitor screen", "printer"
];

const medium_priority = [
  "plastic bottle", "aluminum can", "paper sheet", "cardboard box", "glass bottle", "metal can",
  "plastic container", "plastic cup"
];

const lower_priority = [
  "styrofoam", "ceramic plate", "light bulb", "cigarette butt", "used diaper",
  "apple core", "banana peel", "vegetable waste", "fruit scraps", "dry leaves", "grass clippings"
];

// Function to generate a random credit score within a given range
function getRandomCredit(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to classify object based on detected name
function classifyObject(objectName) {
  objectName = objectName.toLowerCase();
  let material = materialMapping[objectName] || objectName; // Map to proper material name

  if (higher_priority.includes(material)) {
      return { category: "hazardous", priority: "High Priority", credit: getRandomCredit(80, 100) };
  } else if (medium_priority.includes(material)) {
      return { category: "recyclable", priority: "Medium Priority", credit: getRandomCredit(50, 79) };
  } else if (lower_priority.includes(material)) {
      return { category: "compostable", priority: "Low Priority", credit: getRandomCredit(10, 49) };
  } else {
      return { category: "nonRecyclable", priority: "Unknown Priority", credit: 0 };
  }
}

// Function to process and display classification results
function processDetections(detections, ctx, scale) {
  const resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = ''; // Clear previous results

  detections.forEach(item => {
      const result = classifyObject(item.class);
      const { category, priority, credit } = result;
      const disposal = categories[category]?.disposal || "Dispose of properly.";

      // Draw bounding box and label
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.strokeRect(item.bbox[0] * scale, item.bbox[1] * scale, item.bbox[2] * scale, item.bbox[3] * scale);
      ctx.font = '16px Arial';
      ctx.fillStyle = 'red';
      ctx.fillText(`${item.class} (${category})`, item.bbox[0] * scale, item.bbox[1] * scale > 10 ? item.bbox[1] * scale - 5 : 10);

      // Display structured results
      const section = document.createElement('div');
      section.className = 'category';
      section.innerHTML = `
        <h2>${materialMapping[item.class] || item.class}</h2>
        <p><strong>Category:</strong> ${category}</p>
        <p><strong>Priority:</strong> ${priority}</p>
        <p><strong>Credit Points:</strong> ${credit}</p>
        <p><strong>Disposal Instructions:</strong> ${disposal}</p>
      `;
      resultsContainer.appendChild(section);
  });
}
