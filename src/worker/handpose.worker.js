import * as Comlink from 'comlink';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import '@tensorflow/tfjs-core';
// Register WebGL backend.
import '@tensorflow/tfjs-backend-webgl';
// import * as hands from '@mediapipe/hands';

let detector;

async function init() {
  console.log("initiating...")
  const model = handPoseDetection.SupportedModels.MediaPipeHands;
  const detectorConfig = {
    runtime: 'tfjs', // or 'mediapipe',
  }
  detector = await handPoseDetection.createDetector(model, detectorConfig);
  console.log("ready");
}

async function estimateHands(imageData, flipHorizontal = false) {
  const predictions = await detector.estimateHands(imageData);
  return predictions
}

Comlink.expose({
  init,
  estimateHands
})