import React, { useEffect, useState } from "react";
// import Canvas from '../components/Canvas';
// import { isMobile, setupCamera } from '../utils';
// import { HandWorker } from '../worker/handpose.worker';
// import * as Comlink from 'comlink';
import * as fitClasses from "./classes.json";
import { downloadObjectAsJson } from "./helpers";

function CollectPage() {
  const [collect, setCollect] = useState<string>(undefined);
  const [counter, setCounter] = useState<number>(0);
  const [buffer, setBuffer] = useState<[]>([]);
  const [data, setData] = useState<Array<[]>>([]);

  const addEventListeners = async() => {
    if ((DeviceOrientationEvent as any).requestPermission
      && typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      // Handle iOS 13+ devices.
      let permission: PermissionState;
      try {

        permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission !== 'granted') {
          console.log('Request to access the device orientation was rejected');
          return false;
        }

        permission = await (DeviceMotionEvent as any).requestPermission();
        if (permission !== 'granted') {
          console.log('Request to access the device orientation was rejected');
          return false;
        }

      } catch (err) {
        console.log(err);
        return false;
      }
    }

    window.addEventListener('deviceorientation', handleOrientation, true);
    window.addEventListener("devicemotion", handleMotionEvent, true);

  }

  const handleOrientation= (event : DeviceOrientationEvent) => {
    const rotateDegrees = event.alpha; // alpha: rotation around z-axis
    const leftToRight = event.gamma; // gamma: left to right
    const frontToBack = event.beta; // beta: front back motion
    
    setBuffer([...buffer, [rotateDegrees, leftToRight, frontToBack]])
  };

  const handleMotionEvent = (event : DeviceMotionEvent) => {
    const x = event.accelerationIncludingGravity.x;
    const y = event.accelerationIncludingGravity.y;
    const z = event.accelerationIncludingGravity.z;

    setBuffer([...buffer, [x, y, z]]);

  };

  const deleteData = () => {
    setBuffer([]);
  }

  const registerData = () => {
    setData([...data, [...buffer]]);
    setCounter(counter + 1);
  };

  const handleClickClass = async(value: string, status : string) => {
    if(status === "start") await addEventListeners();
    else {
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('devicemotion', handleMotionEvent);
      downloadObjectAsJson(data, `${collect}-data`)
    }
    setCollect(value);
    setCounter(0);
  };

  return (
    <>
      {fitClasses &&
        Object.keys(fitClasses).map((value, index) => (
          <button onClick={() => handleClickClass(value, "start")} key={index}>
            {value}
          </button>
        ))}
      {collect && (
        <div>
          Collected data: {counter}
          Current data: {buffer}
          <button onClick={deleteData}>Delete Data</button>
          <button onClick={registerData} styles={{'padding': '30px 30px'}}>Register Data</button>
          <button onClick={() => handleClickClass(undefined, "end")}>
            End Collect
          </button>
        </div>
      )}
    </>
  );
}

export default CollectPage;
