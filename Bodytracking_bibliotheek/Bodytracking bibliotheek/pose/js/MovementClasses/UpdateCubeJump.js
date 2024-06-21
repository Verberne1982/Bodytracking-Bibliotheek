// UpdateCubeJump.js

class UpdateCubeJump {
    constructor(cube) {
      this.cube = cube;
      this.previousY = 0;
      this.smoothingFactorY = 0.8;
    }
  
    updateCubeJump(landmarks) {
      if (!landmarks) return;
  
      // Bereken de gemiddelde y-coördinaat van landmarks 11 en 12
      const averageY = (landmarks[11].y + landmarks[12].y) / 2;
  
      // Schaal y-coördinaat naar een geschikte hoogte (omgekeerd, omdat hogere y-waarden op het scherm lager zijn in de 3D-ruimte)
      const targetY = (0.5 - averageY) * 10; 
  
      // Smoothing door een bewegingsgemiddelde
      const y = this.previousY + (targetY - this.previousY) * this.smoothingFactorY;
  
      // Controleer of de coördinaat NaN is
      if (isNaN(y)) return;
  
      // Update vorige waarden
      this.previousY = y;
  
      // Stel de positie van de kubus in op de y-as (hoogte)
      this.cube.position.set(this.cube.position.x, y, this.cube.position.z);
    }
  }
  
  export default UpdateCubeJump;
  