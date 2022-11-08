
import React, { useEffect, useState }from 'react';
import Canvas from './Canvas';
import * as Comlink from 'comlink';
import { isMobile, setupCamera } from '../utils';
import { HandWorker } from '../worker/handpose.worker';

function App() {
  
  const [video, setVid] = useState();

  useEffect(() => {
    async function initCamera() {
      const mobile = isMobile;
      const vid = await setupCamera(mobile);
      setVid(vid);
      // console.log(vid.play());
      vid.play();
    }

    initCamera();

    return () => {}

  }, [])

  const draw = (ctx, frameCount) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.fillStyle = '#000000'
    ctx.beginPath()
    ctx.arc(50, 100, 20*Math.sin(frameCount*0.05)**2, 0, 2*Math.PI)
    ctx.fill()
  }
  
  return (
    <>
      {video ? <Canvas draw={draw} video={video}/> : null }
    </>
    )
}

export default App