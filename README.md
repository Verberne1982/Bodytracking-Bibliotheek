Posetracking Mediapipe
======================

This project integrates the Mediapipe Pose Landmarker with a 3D cube visualization using Three.js. The application tracks human poses from webcam input and uses this data to manipulate a 3D cube in real-time.

Table of Contents
-----------------

*   [Setup](#setup)
    
*   [Usage](#usage)
    
*   [Project Structure](#project-structure)
    
*   [Functionality](#functionality)
    
*   [Code Explanation](#code-explanation)
    
*   [Troubleshooting](#troubleshooting)
    

Setup
-----

### Prerequisites

Before you start, ensure you have the following installed:

*   A modern web browser (preferably Google Chrome)
    
*   A webcam
    
*   A local server to serve the files (e.g., Live Server in VSCode)
    

### Installation

1.  Clone the repository or download the project files.
    
2.  Open the project directory in your code editor.
    

### Running the Project

1.  Ensure you are running a local server in your project directory.
    
2.  Open index.html in your browser via the local server.
    
3.  Click the "Webcam inschakelen" button to enable the webcam and start pose tracking.
    

Usage
-----

1.  **Enable Webcam**: Click the "Webcam inschakelen" button to start the webcam feed.
    
2.  **Interact with the Cube**: Use various gestures to interact with the 3D cube:
    
    *   **Move Cube**: Move your body to the left or right to move the cube along the X-axis.
        
    *   **Scale Cube**: Move your hands closer or farther apart to scale the cube.
        
    *   **Jump Cube**: Move your hands up and down to move the cube along the Y-axis.
        
    *   **Change Color**: Make a specific pose to change the color of the cube.
        
    *   **Rotate Cube**: Raise your hand above a certain point to start or stop the cube's rotation.
        

Project Structure
-----------------

project-directory/  │  ├── js/  │   └── posetracking.js  ├── style.css  ├── index.html  └── models/      └── pose_landmarker_full.task   `

*   **js/posetracking.js**: Contains the main JavaScript code for pose tracking and 3D cube manipulation.
    
*   **style.css**: Contains the styling for the webpage.
    
*   **index.html**: The main HTML file.
    
*   **models/pose\_landmarker\_full.task**: The pose landmark model used by Mediapipe.
    

Functionality
-------------

### Pose Tracking

The application uses Mediapipe to track human poses in real-time from the webcam feed. It then uses the pose landmarks to control the 3D cube's position, scale, color, and rotation.

### Three.js Integration

Three.js is used to render a 3D cube, which is manipulated based on the pose tracking data.

Code Explanation
----------------

### Main Functions

*   **createPoseLandmarker**: Initializes the Mediapipe Pose Landmarker.
    
*   **updateCubePositionX**: Updates the cube's X position based on the detected landmarks.
    
*   **cubeScaling**: Adjusts the cube's scale based on the distance between specific landmarks.
    
*   **cubeJump**: Adjusts the cube's Y position based on the average Y position of specific landmarks.
    
*   **detectAction**: Detects specific poses to trigger an action (e.g., change color).
    
*   **detectInteraction**: Detects specific interactions to control the cube's rotation.
    

### Enabling the Webcam

*   **hasGetUserMedia**: Checks if the browser supports webcam access.
    
*   **enableCam**: Toggles the webcam on and off, and starts the pose prediction loop.
    
*   **initializeThreeJS**: Initializes the Three.js scene, including the camera, renderer, and cube.
    

### Pose Prediction

*   **predictWebcam**: Main loop that performs pose tracking on each video frame and updates the canvas and 3D scene accordingly.
    

Troubleshooting
---------------

*   **Webcam Access**: Ensure your browser has permission to access the webcam.
    
*   **Pose Tracking Not Working**: Make sure the PoseLandmarker model is correctly loaded.
    
*   **Three.js Issues**: Check the console for any errors related to Three.js initialization.
    

Additional Resources
--------------------

*   Mediapipe Documentation
    
*   Three.js Documentation
    

By following this README, you should be able to set up and run the posetracking project successfully. Enjoy interacting with the 3D cube using your body movements!
