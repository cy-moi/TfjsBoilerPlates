import * as Comlink from 'comlink';
import * as tf from '@tensorflow/tfjs'
import '@tensorflow/tfjs-core';
// Register WebGL backend.
import '@tensorflow/tfjs-backend-webgl';


export class MyModelWorker {

  private model? : any;

  public async init() {
    console.log("initiating...")
    this.model = await tf.loadLayersModel('./my-model');

    console.log(this.model)
    console.log("ready");
  }

  public ready() {
    return this.model !== undefined;
  }
  
  public async estimate(buffer = null, flipHorizontal = false) {
    // console.log(this.detector, "estimate")
    if(this.model === undefined) return null;
    const predictions = await this.model.predict(buffer);
    return predictions
  }
}


Comlink.expose(new MyModelWorker())