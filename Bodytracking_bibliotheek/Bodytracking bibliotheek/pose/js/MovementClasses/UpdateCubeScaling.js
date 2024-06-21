// CubeController.js

class UpdateCubeScaling {
    constructor(cube) {
      this.cube = cube;
      this.previousScale = 1;
      this.scaleSmoothingFactor = 0.8;
    }
  
    updateCubeScaling(landmarks) {
      if (!landmarks || !landmarks[11] || !landmarks[12]) {
        console.log("Invalid landmarks data:", landmarks);
        return;
      }
  
      // Bereken de afstand tussen landmarks 11 en 12
      const dx = landmarks[11].x - landmarks[12].x;
      const dy = landmarks[11].y - landmarks[12].y;
      //const dz = landmarks[11].z - landmarks[12].z;
      const distance = Math.sqrt(dx * dx + dy * dy/* + dz * dz*/);
  
      // Pas de afstand aan zodat de kubus dichterbij komt bij een grotere afstand tussen de landmarks
      const baseScale = 0.5; // Basiswaarde voor de schaal
      const scaleMultiplier = 4; // Aangepaste schaalfactor om de kubus kleiner te maken
      const targetScale = baseScale + distance * scaleMultiplier;
  
      // Smoothing door een bewegingsgemiddelde
      const smoothedScale = this.previousScale + (targetScale - this.previousScale) * this.scaleSmoothingFactor;
  
      // Stel de schaal van de kubus in
      this.cube.scale.set(smoothedScale, smoothedScale, smoothedScale);
  
      // Update vorige schaalwaarde
      this.previousScale = smoothedScale;
      console.log("updateCubeScaling aangeroepen")
    }
  }
  export default UpdateCubeScaling;