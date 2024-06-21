// cubeController.js

class UpdateCubePositionX {
  constructor(cube) {
    this.cube = cube;
    this.previousX = 0;
    this.smoothingFactor = 0.2;
  }

  updatePositionX(landmarks) {
    if (!landmarks) return;
    console.log("UpdateCubePositionX: Update positie X");
    // Posities zijn relatief aan het canvas, we moeten ze converteren naar de positie in de 3D-ruimte
    const targetX = (landmarks[11].x - 0.6) * 10; // Schaal x-coördinaat naar -5 tot 5

    // Smoothing door een bewegingsgemiddelde
    const x = this.previousX + (targetX - this.previousX) * this.smoothingFactor;

    // Controleer of de coördinaat NaN is
    if (isNaN(x)) return;

    // Update vorige waarden
    this.previousX = x;

    // Stel de positie van de kubus in
    this.cube.position.set(x, this.cube.position.y, this.cube.position.z);
  }
}

export default UpdateCubePositionX;
