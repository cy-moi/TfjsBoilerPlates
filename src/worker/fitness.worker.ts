import * as Comlink from 'comlink';
import * as tf from '@tensorflow/tfjs'
import '@tensorflow/tfjs-core';
// Register WebGL backend.
import '@tensorflow/tfjs-backend-webgl';
import { processData } from '../fitnessApp/trainModel';


export class MyModelWorker {

  model? : any;

  public async init(url) {
    console.log("initiating...")
    this.model = await tf.loadLayersModel(url + '/assets/my-model.json');

    console.log(this.model)
    console.log("ready");
  }

  public async ready() {
    console.log("ready ", this.model);
    return this.model !== undefined;
  }
  
  public async estimate(buffer = null, flipHorizontal = false) {
    // console.log(this.detector, "estimate")
    const tensor = processData(buffer);
    console.log(this.model);
    if(this.model === undefined) return null;
    const predictions = await this.model.predict(tensor);
    predictions.print()
    return predictions.array()
  }
}


Comlink.expose(new MyModelWorker())