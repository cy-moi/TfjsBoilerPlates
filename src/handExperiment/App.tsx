
import React, { useEffect, useState }from 'react';
import Canvas from './Canvas';
import { isMobile, setupCamera } from '../utils';
import { HandWorker } from '../worker/handpose.worker';
import * as Comlink from 'comlink';

function App() {
  const worker : Comlink.Remote<HandWorker> = Comlink.wrap(
    new Worker(new URL(`../worker/handpose.worker.ts`, import.meta.url))
  );
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
      {video ? <Canvas draw={draw} video={video} worker={worker}/> : null }
    </>
    )
}

export default App