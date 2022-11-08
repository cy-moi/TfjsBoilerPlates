
import React, { useLayoutEffect, useState }from 'react';
import Canvas from './Canvas';
import * as Comlink from 'comlink';
import { isMobile, setupCamera } from '../utils';
import { HandWorker } from '../worker/handpose.worker';

function App() {
  
  const worker : Comlink.Remote<HandWorker> = Comlink.wrap(
    new Worker(new URL(`../worker/handpose.worker.ts`, import.meta.url))
  );

  const [video, setVid] = useState<HTMLVideoElement>(null);

  useLayoutEffect(() => {
    async function initCamera() {
      const mobile = isMobile;
      console.log(document.getElementById("video"))
      const vid = await setupCamera(mobile);
      setVid(vid);
      console.log(vid);
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
  
  return <Canvas draw={draw} worker={worker} video={video}/>
}

export default App