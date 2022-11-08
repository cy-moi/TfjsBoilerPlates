import React, { useRef, useEffect } from 'react';
import * as Comlink from 'comlink';

const Canvas = props => {

  const { video, worker, draw } : {video: HTMLVideoElement, worker: Comlink.Remote<any>, draw : Function} = props;

  const canvasRef = useRef(null);

  useEffect(() => {
    
    async function initModel() {
      video.play();
      await worker.init();
    }

    initModel();

  }, []);
  
  useEffect(() => {
    
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    let frameCount = 0
    let animationFrameId
    
    //Our draw came here
    const render = () => {
      frameCount++
      worker.estimate(null);
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