import '@mediapipe/face_mesh';
import '@tensorflow/tfjs-core';
// Register WebGL backend.
import '@tensorflow/tfjs-backend-webgl';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';

let detector;

export async function init() {
  const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
  const detectorConfig = {
    runtime: 'tfjs'
  };
  detector = await faceLandmarksDetection.createDetector(model, detectorConfig);
}

export async function estimateFaces(image, flipHorizontal = false) {
  const predictions = await detector.estimateFaces(image, {flipHorizontal});
  return predictions;

}