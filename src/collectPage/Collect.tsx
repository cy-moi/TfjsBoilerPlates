import React, { useEffect, useState } from "react";
import fitClasses from "./classes.json";
import { downloadObjectAsJson } from "./helpers";
import './styles.css';
import * as tfvis from '@tensorflow/tfjs-vis';
import { trainModel } from "./trainModel";

function CollectPage() {
  const [collect, setCollect] = useState<string>(undefined);
  const [counter, setCounter] = useState<number>(0);
  const [buffer, setBuffer] = useState({});
  const [allbuffer, setAll] = useState([]);
  const [data, setData] = useState<Array<[]>>([]);
  const [start, setStart] = useState(null);

  const surface = tfvis.visor().surface({name: "surf", tab: "my tab"})

  // useEffect(() => {
  //   console.log("training");
  //   trainModel()}, [])

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

    // window.addEventListener('deviceorientation', handleOrientation, true);
    window.addEventListener("devicemotion", handleMotionEvent, true);

  }

  useEffect(() => {
    // console.log(buffer)
    setAll([...allbuffer, buffer])
  }, [buffer])

  const handleOrientation= (event : DeviceOrientationEvent) => {
    const rotateDegrees = event.alpha; // alpha: rotation around z-axis
    const leftToRight = event.gamma; // gamma: left to right
    const frontToBack = event.beta; // beta: front back motion

    // setBuffer([...buffer, rotateDegrees, leftToRight, frontToBack])
    // setInterval(()=> {
      // const time = Date.now() - start;
      setBuffer({"orientation": [rotateDegrees, leftToRight, frontToBack]});
    // }, 500)
  };

  const handleMotionEvent = (event : DeviceMotionEvent) => {
    const x = event.accelerationIncludingGravity.x;
    const y = event.accelerationIncludingGravity.y;
    const z = event.accelerationIncludingGravity.z;

    const rotateDegrees = event.rotationRate.alpha; // alpha: rotation around z-axis
    const leftToRight = event.rotationRate.gamma; // gamma: left to right
    const frontToBack = event.rotationRate.beta; // beta: front back motion


    // setInterval(()=> {
      // const time = Date.now() - start;
      setBuffer({"motion": [x, y, z, rotateDegrees, leftToRight, frontToBack]});
    // }, 500)

  };

  const deleteData = () => {
    // setBuffer({});
    setAll([])
  }

  const registerData = () => {
    setData([...data, [...allbuffer]]);
    setCounter(counter + 1);
    setAll([]);
  };

  const saveDataToLocalStorage = () => {
    localStorage.setItem(`${collect}`, data);
  }

  const handleClickClass = async(value: string, status : string) => {
    setStart(Date.now());
    if(status === "start") await addEventListeners();
    else {
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('devicemotion', handleMotionEvent);
      downloadObjectAsJson(data, `${collect}`);
      saveDataToLocalStorage();
      setData([]);
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
            {value }
          </button>
        ))}
    </div>

      {collect && (
        <div>
          <h3>Collected data: {counter}</h3>
          <h3>Current data: {Object.values(buffer)}</h3>
          <h3>Data will be downloaded and saved in localStorage</h3>
          <div>
            <button onClick={deleteData} className="restart">Restart</button>
            <button onClick={registerData} className="submit">Register Data</button>
            <button onClick={() => handleClickClass(undefined, "end")}>
              End and Save Data
            </button>
            <button>upload data</button>
          </div>
        </div>
      )}
      
      <button onClick={() => trainModel(surface)} className="submit">train model</button>

    </>
  );
}

export default CollectPage;
