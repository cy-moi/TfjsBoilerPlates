import * as Comlink from 'comlink';
// import { init, estimateHands } from '../models/handpose';
import { isMobile, setupCamera } from '../utils';
import { Parts, createParts, updateParts, renderParts} from './particles';
import './styles.css';


const mobile = isMobile();

let ctx;

const {
  init, estimateHands,
} = Comlink.wrap(
    new Worker(new URL('../worker/handpose.worker.js', import.meta.url))
  );

mainWorker()
// mainAlt()
async function mainWorker() {
  const video = await setupCamera(mobile);
  video.play();
  const { videoWidth, videoHeight } = video;
  console.log(`${videoWidth} x ${videoHeight}`);

  await init()

  const canvas = document.getElementById('output');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  ctx = canvas.getContext('2d');
  ctx.strokeStyle = 'red';
  ctx.fillStyle = 'red';
  ctx.clearRect(0, 0, videoWidth, videoHeight);
  console.log("inited");
  requestAnimationFrame(landmarksContinue)
}

async function landmarks() {
  const imageData = await getImageFromVideo()
  const predictions = await estimateHands(imageData, {width: video.videoWidth, height: video.videoHeight});
  ctx.clearRect(0, 0, video.videoWidth, video.videoHeight);
  ctx.globalCompositeOperation = 'source-over';
  ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0,
    video.videoWidth, video.videoHeight);

    if(predictions.length > 1) results = [];
    for(const predict of predictions) {
      if (predict.handedness == 'Right' || predict.handedness == 'Left') {
        results.push(predict.keypoints);
  
      }
    }
  
    for(const result of results) {
      var distance = ((result[4].x - result[12].x)**2 + (result[4].y - result[12].y)**2)**0.5
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'hsla(0, 0%, 0%, .3)';
      // ctx.clearRect(0, 0, video.videoWidth, video.videoHeight);
      ctx.globalCompositeOperation = 'lighter';
      console.log(...result[9])
      createParts({...result[9]}, {min:1, max:distance});
      updateParts({...result[9]}, {min:1, max:distance});
      renderParts();
      globalTick++;
    }
  
}

async function landmarksContinue() {
  await landmarks();
  requestAnimationFrame(landmarksContinue)
}

async function getImageFromVideo() {
  const video = document.getElementById('video')
  const canvas = document.createElement('canvas')
  // canvas.style += " max-width: 100%";
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, video.videoWidth, video.videoHeight);
  ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0,
    canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, video.videoWidth, video.videoHeight)
  return imageData;
}

const clear = function(){
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = 'hsla(0, 0%, 0%, .3)';
  ctx.fillRect(0, 0, cw, ch);
  ctx.globalCompositeOperation = 'lighter';
};

const loop = function(){
  window.requestAnimFrame(loop, ctx);
  clear();
  createParts();
  updateParts();
  renderParts(ctx);
  globalTick++;
};