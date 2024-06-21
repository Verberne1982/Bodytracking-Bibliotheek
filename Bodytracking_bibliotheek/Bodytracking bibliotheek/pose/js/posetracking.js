"use strict"
import {
  PoseLandmarker,
  FilesetResolver,
  DrawingUtils
} from "https://cdn.skypack.dev/@mediapipe/tasks-vision@0.10.0";
//import * as THREE from 'three';

import ThreejsCube from "./GameImplementation/ThreejsCube";

// import UpdateCubePositionX from './MovementClasses/UpdateCubePositionX.js';
// import UpdateCubeScaling from "./MovementClasses/UpdateCubeScaling.js";
// import UpdateCubeJump from "./MovementClasses/UpdateCubeJump.js";
// import DetectAction from "./MovementClasses/DetectAction.js";
// import DetectInteraction from "./MovementClasses/DetectInteraction.js";

let poseLandmarker = undefined;
let enableWebcamButton;
let webcamRunning = false;
// let renderer; // Renderer variabele
// let camera; // Camera variabele
// let scene; // Scène variabele
// let cube; // Kubus variabele

// let cubePositionUpdater;
// let cubeScalingUpdater;
// let cubeJumpUpdater;
// let actionDetector;
// let interactionDetector;

let landmarks = [];
let threeJScube;

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

// Functie om te controleren of de browser toegang heeft tot de webcam.
console.log("webcam acces");
const hasGetUserMedia = () => !!navigator.mediaDevices?.getUserMedia;
console.log("user media")
// Voeg een eventlistener toe aan de knop om de webcam te activeren wanneer deze wordt geklikt
if (hasGetUserMedia()) {
  enableWebcamButton = document.getElementById("webcamButton");
  enableWebcamButton.addEventListener("click", enableCam);
} else {
  console.warn("getUserMedia() wordt niet ondersteund door je browser");
}

// Functie om de webcam te activeren en pose tracking te starten.
function enableCam(event) {
  console.log("enable webcam");
  if (!poseLandmarker) {
    console.log("Wacht! poseLandmarker is nog niet geladen.");
    return;
  }

 

  // Wissel de status van de webcamRunning-variabele en pas de knoptekst aan.
  webcamRunning = !webcamRunning;
  enableWebcamButton.innerText = webcamRunning ? "VOORSPELLINGEN UITSCHAKELEN" : "VOORSPELLINGEN INSCHAKELEN";

  const constraints = { video: true };

  // if (webcamRunning) {
  //   console.log("webcam");
  //   navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
  //     video.srcObject = stream;
  //     video.addEventListener("loadeddata", predictWebcam);
      threeJScube = new ThreejsCube();
      threeJScube.initialize("ThreeJS_output");//.catch(console.error("error"));
      
      // function animate(){

      //   requestAnimationFrame(animate);


      // }
      // animate();


      //initializeThreeJS(); // Initialiseer Three.js nadat de video is geladen
      

  //     console.log("voor aanroep van de klasses")
  // cubePositionUpdater = new UpdateCubePositionX(threeJScube.cube);
  // cubeScalingUpdater = new UpdateCubeScaling(threeJScube.cube);
  // cubeJumpUpdater = new UpdateCubeJump(threeJScube.cube);
  // actionDetector = new DetectAction(threeJScube.cube);
  // interactionDetector = new DetectInteraction(threeJScube.cube);


//     });
//   } else {
//     video.srcObject.getTracks().forEach(track => track.stop());
//     video.srcObject = null;
//   }
 }




// Functie om Three.js te initialiseren en een kubus bovenop de webcamfeed weer te geven
// function initializeThreeJS() {
//   const canvasWidth = 400;
//   const canvasHeight = 300;
//   const aspectRatio = canvasWidth / canvasHeight;

//   // Maak een renderer voor Three.js
//   renderer = new THREE.WebGLRenderer({ canvas: threeJS });
//   renderer.setSize(canvasWidth, canvasHeight);

//   // Maak een camera
//   camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
//   camera.position.z = 5; // Zet de camera terug om de kubus te zien

//   // Maak een Three.js-scène
//   scene = new THREE.Scene();

//   // Maak een kubus
//   const geometry = new THREE.BoxGeometry(1, 1, 1);
//   const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
//   cube = new THREE.Mesh(geometry, material);

//   // Voeg randen toe aan de kubus voor visualisatie
//   const edgesGeometry = new THREE.EdgesGeometry(geometry);
//   const edgesMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 });
//   const cubeEdges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
//   cube.add(cubeEdges);

//   // Voeg licht toe aan de scène
//   const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
//   scene.add(ambientLight);

//   const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
//   directionalLight.position.set(0, 1, 0);
//   scene.add(directionalLight);

//  //Voeg de kubus toe aan de scène
//scene.add(threeJScube.initialize("ThreeJS_output"));

  //--------------------------------------------------------------
  // classes met bewegingen

  


  //--------------------------------------------------------------

  // // Render de scène
  function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    console.log("render")
    console.log("Landmarks voor update:", landmarks);
  }
  render();

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
        
        //cubePositionUpdater.updatePositionX(landmarks);
        //cubeScalingUpdater.updateCubeScaling(landmarks);
        //cubeJumpUpdater.updateCubeJump(landmarks);
        //actionDetector.detectAction(landmarks);
        //interactionDetector.detectInteraction(landmarks);
      }
    }

    canvasCtx.restore();
  }

  // Vraag het volgende animatie frame aan om de lus te laten doorgaan
  if (webcamRunning) {
    window.requestAnimationFrame(predictWebcam);
  }
}
