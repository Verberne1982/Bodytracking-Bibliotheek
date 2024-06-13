import {
  PoseLandmarker,
  FilesetResolver,
  DrawingUtils
} from "https://cdn.skypack.dev/@mediapipe/tasks-vision@0.10.0";
import * as THREE from 'three';

let poseLandmarker = undefined;
let enableWebcamButton;
let webcamRunning = false;
let renderer; // Renderer variabele
let camera; // Camera variabele
let scene; // Scène variabele
let cube; // Kubus variabele

// Functie om de PoseLandmarker-klasse te maken wanneer deze is geladen.
const createPoseLandmarker = async () => {
  // Haal de FilesetResolver op voor visuele taken.
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
  );

  // Maak een PoseLandmarker-object met de gewenste opties.
  poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: `./models/pose_landmarker_full.task`,
      delegate: "GPU",
    },
    runningMode: "VIDEO",
    numPoses: 2,
  });
};
createPoseLandmarker();

// Haal de video- en canvaselementen op uit het HTML-document.
const video = document.getElementById("webcam");
const canvasElement = document.getElementById("output_canvas");
const threeJS = document.getElementById("ThreeJS_output");
const canvasCtx = canvasElement.getContext("2d");

let previousX = 0;
const smoothingFactor = 0.2;

//-------------------------------------------------------------------------------------------
// Functie om de positie van de kubus bij te werken op basis van poseTracking
function updateCubePositionX(landmarks) {
  if (!landmarks) return;

  // Posities zijn relatief aan het canvas, we moeten ze converteren naar de positie in de 3D-ruimte
  const targetX = (landmarks[11].x - 0.6) * 10; // Schaal x-coördinaat naar -5 tot 5

  // Smoothing door een bewegingsgemiddelde
  const x = previousX + (targetX - previousX) * smoothingFactor;

  // Controleer of de coördinaat NaN is
  if (isNaN(x)) return;

  // Update vorige waarden
  previousX = x;

  // Stel de positie van de kubus in
  cube.position.set(x, cube.position.y, cube.position.z);
}

let previousScale = 1;
const scaleSmoothingFactor = 0.8;

// Functie om de schaal van de kubus bij te werken op basis van poseTracking
function cubeScaling(landmarks) {
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

  // Stel de schaal van de kubus in
  cube.scale.set(targetScale, targetScale, targetScale);
}


let previousY = 0;
const smoothingFactorY = 0.8;

// Functie om de hoogte (y-as) van de kubus bij te werken op basis van poseTracking
function cubeJump(landmarks) {
  if (!landmarks) return;

  // Bereken de gemiddelde y-coördinaat van landmarks 11 en 12
  const averageY = (landmarks[11].y + landmarks[12].y) / 2;

  // Schaal y-coördinaat naar een geschikte hoogte (omgekeerd, omdat hogere y-waarden op het scherm lager zijn in de 3D-ruimte)
  const targetY = (0.5 - averageY) * 10; 

  // Smoothing door een bewegingsgemiddelde
  const y = previousY + (targetY - previousY) * smoothingFactorY;

  // Controleer of de coördinaat NaN is
  if (isNaN(y)) return;

  // Update vorige waarden
  previousY = y;

  // Stel de positie van de kubus in op de y-as (hoogte)
  cube.position.set(cube.position.x, y, cube.position.z);
}

// Functie om een actie uit te voeren wanneer een bepaalde pose wordt gedetecteerd
function detectAction(landmarks) {
  if (!landmarks) return;

  // Controleer of de y-coördinaat van landmark 15 hoger is dan die van landmark 11
  if (landmarks[15].y < landmarks[11].y) {
    // Voer de actie uit
    performAction();
  }
}

// Functie om de actie uit te voeren
function performAction() {
  // Voorbeeldactie: verander de kleur van de kubus
  cube.material.color.set(Math.random() * 0xffffff);
}

// Variabele om de rotatie bij te houden
let isRotating = false;

// Functie om de rotatie van de kubus te activeren op basis van handlandmarks
function detectInteraction(landmarks) {
  if (!landmarks) return;

  if (landmarks[14].y < landmarks[12].y) {
    // Voer de actie uit
    performInteraction();
  
  } else {
    // Landmarker 14 is niet boven landmark 12
    stopInteraction();
  }
}

// Functie om de rotatie van de kubus te starten
function performInteraction() {
  cube.rotation.y += 0.2; // Bijvoorbeeld: roteer 0.02 radialen per frame
}

// Functie om de rotatie van de kubus te stoppen
function stopInteraction() {
  isRotating = false;
}





//-------------------------------------------------------------------------------------------

// Functie om te controleren of de browser toegang heeft tot de webcam.
const hasGetUserMedia = () => !!navigator.mediaDevices?.getUserMedia;

// Voeg een eventlistener toe aan de knop om de webcam te activeren wanneer deze wordt geklikt
if (hasGetUserMedia()) {
  enableWebcamButton = document.getElementById("webcamButton");
  enableWebcamButton.addEventListener("click", enableCam);
} else {
  console.warn("getUserMedia() wordt niet ondersteund door je browser");
}

// Functie om de webcam te activeren en pose tracking te starten.
function enableCam(event) {
  if (!poseLandmarker) {
    console.log("Wacht! poseLandmarker is nog niet geladen.");
    return;
  }

  // Wissel de status van de webcamRunning-variabele en pas de knoptekst aan.
  webcamRunning = !webcamRunning;
  enableWebcamButton.innerText = webcamRunning ? "VOORSPELLINGEN UITSCHAKELEN" : "VOORSPELLINGEN INSCHAKELEN";

  const constraints = { video: true };

  if (webcamRunning) {
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      video.srcObject = stream;
      video.addEventListener("loadeddata", predictWebcam);

      initializeThreeJS(); // Initialiseer Three.js nadat de video is geladen
    });
  } else {
    video.srcObject.getTracks().forEach(track => track.stop());
    video.srcObject = null;
  }
}

// Functie om Three.js te initialiseren en een kubus bovenop de webcamfeed weer te geven
function initializeThreeJS() {
  const canvasWidth = 400;
  const canvasHeight = 300;
  const aspectRatio = canvasWidth / canvasHeight;

  // Maak een renderer voor Three.js
  renderer = new THREE.WebGLRenderer({ canvas: threeJS });
  renderer.setSize(canvasWidth, canvasHeight);

  // Maak een camera
  camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
  camera.position.z = 5; // Zet de camera terug om de kubus te zien

  // Maak een Three.js-scène
  scene = new THREE.Scene();

  // Maak een kubus
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  cube = new THREE.Mesh(geometry, material);

  // Voeg randen toe aan de kubus voor visualisatie
  const edgesGeometry = new THREE.EdgesGeometry(geometry);
  const edgesMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 });
  const cubeEdges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
  cube.add(cubeEdges);

  // Voeg licht toe aan de scène
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(0, 1, 0);
  scene.add(directionalLight);

  // Voeg de kubus toe aan de scène
  scene.add(cube);

  // Render de scène
  function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
  render();
}

let lastVideoTime = -1;
const drawingUtils = new DrawingUtils(canvasCtx);

// Functie om pose tracking op de webcamstream uit te voeren.
async function predictWebcam() {
  if (!webcamRunning) {
    return;
  }

  if (lastVideoTime !== video.currentTime) {
    lastVideoTime = video.currentTime;
    let startTimeMs = performance.now();

    // Controleer of de video afspeelt en de breedte en hoogte groter dan 0 zijn
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      window.requestAnimationFrame(predictWebcam);
      return;
    }

    // Voer pose tracking uit op de video
    let results = await poseLandmarker.detectForVideo(video, startTimeMs);

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    if (results && results.landmarks) {
      for (const landmarks of results.landmarks) {
        // Teken de landmarks en connectors op het canvas
        drawingUtils.drawLandmarks(landmarks, {
          radius: (data) => DrawingUtils.lerp(data.from.z, -0.15, 0.1, 5, 1)
        });
        drawingUtils.drawConnectors(landmarks, PoseLandmarker.POSE_CONNECTIONS, { color: "#00FF00", lineWidth: 1 });

        // Werk de positie van de kubus bij op basis van de landmarks
        updateCubePositionX(landmarks); // Update de kubuspositie met handlandmarks
        cubeScaling(landmarks); // Swipe-gebaar voor beweging
        cubeJump(landmarks); // Open hand voor rotatie
        detectAction(landmarks); // Vuist voor schalen
        detectInteraction(landmarks); // Duim omhoog voor kleurverandering

      }
    }

    canvasCtx.restore();
  }

  // Vraag het volgende animatie frame aan om de lus te laten doorgaan
  if (webcamRunning) {
    window.requestAnimationFrame(predictWebcam);
  }
}
