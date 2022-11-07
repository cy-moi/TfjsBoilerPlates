import * as Comlink from 'comlink';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import { MediaPipeHandsTfjsModelConfig } from '@tensorflow-models/hand-pose-detection';
import '@tensorflow/tfjs-core';
// Register WebGL backend.
import '@tensorflow/tfjs-backend-webgl';


export class HandWorker {
  
  private detector;

  public async init() {
    console.log("initiating...")
    const model = handPoseDetection.SupportedModels.MediaPipeHands;
    const detectorConfig : MediaPipeHandsTfjsModelConfig = {
      runtime: 'tfjs', // or 'mediapipe',
    }
    this.detector = await handPoseDetection.createDetector(model, detectorConfig);
    console.log("ready");
  }
  
  public async estimate(imageData, flipHorizontal = false) {
    const predictions = await this.detector.estimateHands(imageData);
    return predictions
  }
}


Comlink.expose(new HandWorker())