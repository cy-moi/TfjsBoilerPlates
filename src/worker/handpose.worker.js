import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import '@tensorflow/tfjs-core';
// Register WebGL backend.
import '@tensorflow/tfjs-backend-webgl';
import * as hands from '@mediapipe/hands';

let detector;

export async function init() {
  const model = handPoseDetection.SupportedModels.MediaPipeHands;
  const detectorConfig = {
    runtime: 'tfjs', // or 'mediapipe',
  }
  detector = await handPoseDetection.createDetector(model, detectorConfig);
  console.log("ready");
}

export async function estimateHands(detector, imageData, flipHorizontal = false) {
  const predictions = await detector.estimateHands(imageData, flipHorizontal);
  return predictions
}
