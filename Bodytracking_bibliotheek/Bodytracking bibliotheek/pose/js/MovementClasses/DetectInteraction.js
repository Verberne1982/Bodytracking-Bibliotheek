// DetectInteraction.js

class DetectInteraction {
  constructor(cube) {
    this.cube = cube;
    this.isRotating = false;
  }

  detectInteraction(landmarks) {
    if (!landmarks) return;
  
      // Controleer of de y-coördinaat van landmark 15 hoger is dan die van landmark 11
      if (landmarks[14].y < landmarks[12].y) {
        // Voer de actie uit
        this.performAction();
      }
    }
  
    performAction() {
      // Voorbeeldactie: verander de kleur van de kubus
      this.cube.material.color.set(Math.random() * 0xffffff);
    }
  }


export default DetectInteraction;
