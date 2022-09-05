import '@mediapipe/face_mesh';
import '@tensorflow/tfjs-core';
// Register WebGL backend.
import '@tensorflow/tfjs-backend-webgl';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';

let detector;

export async function init() {
  const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
  const detectorConfig = {
    runtime: 'mediapipe',
    solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh',
                  // or 'base/node_modules/@mediapipe/face_mesh' in npm.
  };
  detector = await faceLandmarksDetection.createDetector(model, detectorConfig);
}

export async function estimateFaces(image, flipHorizontal = false) {
  const predictions = await detector.estimateFaces(image, {flipHorizontal});
  return predictions;

}