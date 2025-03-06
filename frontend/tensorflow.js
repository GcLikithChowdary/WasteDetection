document.getElementById('imageUpload').addEventListener('change', handleImageUpload);

async function handleImageUpload(event) {
  const canvas = document.getElementById('canvas');
  const results = document.getElementById('results');
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function () {
    const image = new Image();
    image.src = reader.result;
    image.onload = async function () {
      canvas.width = 500;
      canvas.height = 500;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      // Load AI model & detect objects
      const cocoSsdModel = await cocoSsd.load();
      const detections = await cocoSsdModel.detect(image);

      // Process detections without drawing bounding boxes
      processDetections(detections);
    };
  };
  reader.readAsDataURL(file);
}