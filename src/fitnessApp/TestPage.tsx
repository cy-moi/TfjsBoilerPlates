import React, { useEffect, useState, useMemo} from "react";
import * as Comlink from 'comlink';
import { MyModelWorker } from "src/worker/fitness.worker";
import './styles.css'
import { askPermissionForDeviceMOtion } from "./helpers";
import * as fitClasses from './classes.json';

export default function TestPage() {

  const BUFFER_SIZE = 200;

  const [prediction, setPred] = useState<string>(undefined);
  // const [timer, setTimer] = useState<number>(0);
  const [buffer, setBuffer] = useState([]);
  const [allbuffer, setAll] = useState([]);
  const [result, setRes] = useState(0)
  const [type, setType] = useState(0);

  const [temp, setTemp] = useState(0);

  const [log, setLog] = useState([]);

  const worker : Comlink.Remote<MyModelWorker> = useMemo(() => Comlink.wrap(
    new Worker(new URL(`../worker/fitness.worker.ts`, import.meta.url))
  ), []);

  useEffect(() => {

    setType(Math.round(Math.random() * 3));

    (async() => {
      console.log("initiating...")
      const ind = window.location.href.indexOf("fitness");
      const url = window.location.href.substring(0, ind - 1)

      await worker.init(url);

    })()

  },[])

  useEffect(() => {
    (async() => {
      await askPermissionForDeviceMOtion();
      setLog("permission asked");
      window.addEventListener('devicemotion', handleMotionEvent, true);
    })()
  }, [])


  useEffect(() => {
    // let animationFrameId: number;
    log.push("buffer value changed")


    if(allbuffer.length < BUFFER_SIZE) setAll([...allbuffer, buffer])
    else {
      allbuffer.shift()
      setAll([...allbuffer, buffer])
    }

    const predict = async() => {

      // if(ready) {
        try{
          console.log("predict")
          // const tensor = processData(allbuffer)
          const res = await worker.estimate(allbuffer);
          if(!res) setPred("no prediction")
          else {
            setPred(res[0].indexOf(Math.max(...res[0])));
            if(prediction === type && prediction !== temp) setRes(result + 1);
            setTemp(prediction);
          }
        } catch(err) {
          console.log(err)
          setPred(err.message)
        }
    }

    predict();

  }, [buffer])


  const handleMotionEvent = (event : DeviceMotionEvent) => {
    log.push("motion event fired")
    const x = event.accelerationIncludingGravity.x;
    const y = event.accelerationIncludingGravity.y;
    const z = event.accelerationIncludingGravity.z;

    const rotateDegrees = event.rotationRate.alpha; // alpha: rotation around z-axis
    const leftToRight = event.rotationRate.gamma; // gamma: left to right
    const frontToBack = event.rotationRate.beta; // beta: front back motion

    setTimeout(() =>  setBuffer({"motion": [x, y, z, rotateDegrees, leftToRight, frontToBack]}), 500);
  };


  return (<>
  <button onClick={() => {
    // const test = require('./test.json');
    // setAll(test)
    setBuffer({"motion": [0,0,0,0,0,0]})
  }}>use demo data</button>
  {/* <div>{temp}</div> */}
  <div>{log}</div>
  <div>{prediction}</div>
  <div>DO {Object.keys(fitClasses)[type]} Current Buffer Size {allbuffer.length}</div>
  <div>{result}</div>
  </>)
}