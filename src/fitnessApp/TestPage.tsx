import React, { useEffect, useState } from "react";
import * as Comlink from 'comlink';
import { MyModelWorker } from "src/worker/fitness.worker";
import './styles.css'
import { askPermissionForDeviceMOtion } from "./helpers";
import { processData } from "./trainModel";

export default function TestPage() {

  const BUFFER_SIZE = 15;

  const [prediction, setPred] = useState<string>(undefined);
  const [timer, setTimer] = useState<number>(0);
  const [buffer, setBuffer] = useState([]);
  const [allbuffer, setAll] = useState([]);
  const [result, setRes] = useState({})

  const [temp, setTemp] = useState([]);

  const worker : Comlink.Remote<MyModelWorker> = Comlink.wrap(
    new Worker(new URL(`../worker/fitness.worker.ts`, import.meta.url))
  );

  useEffect(() => {
    (async() => {
      await worker.init(window.location.href.substring(0, window.location.href.length - 8));
    })()

    askPermissionForDeviceMOtion();

    window.addEventListener("devicemotion", handleMotionEvent, true);
  },[])


  useEffect(() => {
    // let animationFrameId: number;

    if(allbuffer.length < BUFFER_SIZE) setAll([...allbuffer, buffer])
    else {
      allbuffer.shift()
      setAll([...allbuffer, buffer])
    }

    const predict = async() => {
      if(worker.ready()) {
        try{
          console.log("predict")
          const buf = processData(allbuffer);
          // console.log(buf);
          setTemp(buf);
          const res = await worker.estimate(buf);
          setPred(res);
          console.log(res);
        } catch(err) {
          console.log(err)
        }

      }
      // animationFrameId = window.requestAnimationFrame(predict);
    }

    predict();

    // return () => {
    //   window.cancelAnimationFrame(animationFrameId);
    // }

  }, [buffer])


  const handleMotionEvent = (event : DeviceMotionEvent) => {
    const x = event.accelerationIncludingGravity.x;
    const y = event.accelerationIncludingGravity.y;
    const z = event.accelerationIncludingGravity.z;

    const rotateDegrees = event.rotationRate.alpha; // alpha: rotation around z-axis
    const leftToRight = event.rotationRate.gamma; // gamma: left to right
    const frontToBack = event.rotationRate.beta; // beta: front back motion

    setBuffer({"motion": [x, y, z, rotateDegrees, leftToRight, frontToBack]});
  };


  return (<>
  <div>{prediction}</div>
  {/* <div>{temp}</div> */}
  </>)
}