import * as Comlink from 'comlink';
import * as tf from '@tensorflow/tfjs'
import '@tensorflow/tfjs-core';
// Register WebGL backend.
import '@tensorflow/tfjs-backend-webgl';


export class MyModelWorker {

  private model? : any;

  public async init(url) {
    console.log("initiating...")
    this.model = await tf.loadLayersModel(url + '/assets/my-model.json');

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