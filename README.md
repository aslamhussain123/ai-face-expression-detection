# AI Face & Facial Expression Detection System

An interactive, real-time AI-powered web application that detects human faces through a webcam and analyzes visible facial expressions using computer vision.

Built with Next.js, React, TypeScript, Material UI, and face-api.js, this application provides real-time face tracking, facial expression classification, and a modern analytics dashboard.

## 🚀 How to Run
```bash
npm install
npm run dev
```
Then open http://localhost:3000


## Key Features

- Uses TensorFlow BlazeFace for real-time face detection.
- Real-time face detection using webcam.
- Multiple face detection.
- Facial expression classification.
- Seven expression categories: Happy, Sad, Angry, Fearful, Disgusted, Surprised, and Neutral.
- Live facial bounding boxes.
- Expression confidence scores.
- Customizable face mask overlay.
- Interactive expression analytics dashboard.
- Browser-based AI model processing.

## Tech Stack

- Next.js
- React.js
- TypeScript
- Material UI (MUI)
- face-api.js
- HTML5 Canvas API
- WebRTC / MediaDevices API

## Project Status

Frontend-only implementation. AI models run directly in the browser. Backend APIs, database integration, and persistent analytics are not currently implemented.

## Privacy

Camera access requires user permission. Webcam processing is performed locally in the browser in the current implementation.
