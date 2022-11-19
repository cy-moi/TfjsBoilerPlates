import React, { useRef, useEffect } from 'react';
import { getImageFromVideo } from '../utils';
import * as Comlink from 'comlink'
import { HandWorker } from '../worker/handpose.worker';
import { useIsomorphicLayoutEffect } from './utils';
import * as THREE from 'three';

const Canvas = props => {

  const { video, draw, worker } : 
    {video: HTMLVideoElement, 
      draw : Function, 
      worker: Comlink.Remote<HandWorker>,
    } = props;

  const canvasRef = useRef(null);
  const [canvas, setCanvas] = React.useState<HTMLCanvasElement | null>(null);
  const [renderer, setRenderer] = React.useState<THREE.Renderer>(null);
  const [scene, setScene] = React.useState<THREE.Scene>(null);
  const [camera, setCamera] = React.useState<THREE.Camera>(null);

  useEffect(() => {


    (async () => {
      
      await worker.init();
    })();

  }, [])

  useIsomorphicLayoutEffect(() => { 
    setCanvas(canvasRef.current);
    setScene(new THREE.Scene());

    setCamera(new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000));
    camera.position.z = 2;
    
    setRenderer(new THREE.WebGLRenderer({canvas: canvasRef,alpha: true}));
    const geometry = new THREE.BoxGeometry()
    const material = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        wireframe: true,
    })

    const cube = new THREE.Mesh(geometry, material)
    scene.add(cube)
  }, []) 
 
  // React.useEffect(() => { 
  //   if (canvas) return () => unmountComponentAtNode(canvas!) 
  // }, [canvas]) 
  
  useEffect(() => {
    const context = canvas.getContext('2d');
    let frameCount = 0
    let animationFrameId
    
    //Our draw came here
    const render = async () => {
      frameCount++
      const imageData = getImageFromVideo(video);
      if(worker.ready()) worker.estimate(imageData);
      draw(context, frameCount)
      animationFrameId = window.requestAnimationFrame(render);
      renderer.render(scene, camera)
    }
    render()
    
    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [draw])
  
  return <canvas ref={canvasRef} />
}

export default Canvas