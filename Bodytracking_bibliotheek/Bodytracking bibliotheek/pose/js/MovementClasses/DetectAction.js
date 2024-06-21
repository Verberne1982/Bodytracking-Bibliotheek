// DetectAction.js

class DetectAction {
    constructor(cube) {
      this.cube = cube;
    }
  
    detectAction(landmarks) {
      if (!landmarks) return;
  
      // Controleer of de y-coördinaat van landmark 15 hoger is dan die van landmark 11
      if (landmarks[15].y < landmarks[11].y) {
        // Voer de actie uit
        this.performAction();
      }
    }
  
    performAction() {
      // Voorbeeldactie: verander de kleur van de kubus
      this.cube.material.color.set(Math.random() * 0xffffff);
    }
  }
  
  export default DetectAction;
  
