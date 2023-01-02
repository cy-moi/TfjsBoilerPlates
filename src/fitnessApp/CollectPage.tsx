import React, { useEffect, useState } from "react";
// import Canvas from '../components/Canvas';
// import { isMobile, setupCamera } from '../utils';
// import { HandWorker } from '../worker/handpose.worker';
// import * as Comlink from 'comlink';
import * as fitClasses from "./classes.json";
import { downloadObjectAsJson } from "./helpers";
import './styles.css'

function CollectPage() {
  const [collect, setCollect] = useState<string>(undefined);
  const [counter, setCounter] = useState<number>(0);
  const [buffer, setBuffer] = useState([]);
  const [allbuffer, setAll] = useState([]);
  const [data, setData] = useState<Array<[]>>([]);
  const [start, setStart] = useState(null);

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

    window.addEventListener('deviceorientation', handleOrientation);
    window.addEventListener("devicemotion", handleMotionEvent, true);

  }

  // useEffect(() => {
  //   console.log(buffer)
  //   setAll([...allbuffer, ...buffer, 0])
  // }, [buffer])

  const handleOrientation= (event : DeviceOrientationEvent) => {
    const rotateDegrees = event.alpha; // alpha: rotation around z-axis
    const leftToRight = event.gamma; // gamma: left to right
    const frontToBack = event.beta; // beta: front back motion
    
    // setBuffer([...buffer, rotateDegrees, leftToRight, frontToBack])
    requestAnimationFrame(()=> {
      const time = Date.now() - start;
      setBuffer(...buffer, {time: rotateDegrees, leftToRight, frontToBack});
    })
  };

  const handleMotionEvent = (event : DeviceMotionEvent) => {
    const x = event.accelerationIncludingGravity.x;
    const y = event.accelerationIncludingGravity.y;
    const z = event.accelerationIncludingGravity.z;

    requestAnimationFrame(()=> {
      setBuffer(...buffer, {time: x, y, z});
    })

  };

  const deleteData = () => {
    setBuffer([]);
  }

  const registerData = () => {
    setData([...data, [...buffer]]);
    setCounter(counter + 1);
  };

  const handleClickClass = async(value: string, status : string) => {
    setStart(Date.now());
    if(status === "start") await addEventListeners();
    else {
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('devicemotion', handleMotionEvent);
      downloadObjectAsJson(data, `${collect}`)
    }
    setCollect(value);
    setCounter(0);
  };

  return (
    <>
    <div styles={{display: 'flex'}}>
      {fitClasses &&
        Object.keys(fitClasses).map((value, index) => (
          <button onClick={() => handleClickClass(value, "start")} key={index}>
            {value}
          </button>
        ))}
    </div>

      {collect && (
        <div>
          Collected data: {counter}
          <br></br>
          Current data: {buffer}
          <div>
            <button onClick={deleteData}>Delete Data</button>
            <button onClick={registerData} className="submit">Register Data</button>
            <button onClick={() => handleClickClass(undefined, "end")}>
              End Collect
            </button>
          </div>

        </div>
      )}
    </>
  );
}

export default CollectPage;
