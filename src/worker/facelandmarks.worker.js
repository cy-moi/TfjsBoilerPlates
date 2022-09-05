import * as Comlink from 'comlink';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import '@tensorflow/tfjs-core';
// Register WebGL backend.
import '@tensorflow/tfjs-backend-webgl';
// import '@mediapipe/face_mesh';

let detector;

async function init() {
  const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
  const detectorConfig = {
    runtime: 'tfjs'
  };
  detector = await faceLandmarksDetection.createDetector(model, detectorConfig);
  console.log('ready')
}

async function estimateFaces(image, flipHorizontal = false) {
  const predictions = await detector.estimateFaces(image, {flipHorizontal});
  return predictions;

}

Comlink.expose({
  init, estimateFaces,
})