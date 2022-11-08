import React, { useRef, useEffect } from 'react';
import { getImageFromVideo } from '../utils';
import { HandWorker } from '../worker/handpose.worker';
import * as Comlink from 'comlink';

const Canvas = props => {
  const worker : Comlink.Remote<HandWorker> = Comlink.wrap(
    new Worker(new URL(`../worker/handpose.worker.ts`, import.meta.url))
  );

  const { video, draw } : {video: HTMLVideoElement, draw : Function} = props;

  const canvasRef = useRef(null);

  useEffect(() => {

    (async () => {
      await worker.init();
    })();

  }, [])
  
  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    let frameCount = 0
    let animationFrameId
    
    //Our draw came here
    const render = async () => {
      frameCount++
      const imageData = getImageFromVideo(video);
      if(worker.ready()) worker.estimate(imageData);
      draw(context, frameCount)
      animationFrameId = window.requestAnimationFrame(render)
    }
    render()
    
    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [draw])
  
  return <canvas ref={canvasRef} />
}

export default Canvas