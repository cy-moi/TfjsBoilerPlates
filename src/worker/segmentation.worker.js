import * as Comlink from 'comlink';
import { SelfieSegmentation } from '@mediapipe/selfie_segmentation';
// import SelfieSegmentation from '@mediapipe/selfie_segmentation';
import '@tensorflow/tfjs-core';
// Register WebGL backend.
import '@tensorflow/tfjs-backend-webgl';
// import * as hands from '@mediapipe/hands';



async function segment(imageData, selfieSegmentation, flipHorizontal = false) {
    const predictions = await selfieSegmentation.send({image: imageData});
//  return predictions
}

Comlink.expose({
  segment
})