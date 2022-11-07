import * as Comlink from 'comlink';
import { SelfieSegmentation } from '@mediapipe/selfie_segmentation';
import { drawPoint, isMobile, setupCamera } from '../utils';
// import './index.css';

const mobile = isMobile();

let ctx;

let selfieSegmentation;

async function init() {
  console.log("initiating...")

  console.log(SelfieSegmentation);
  selfieSegmentation = new SelfieSegmentation({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
  });
  await selfieSegmentation.initialize();
  selfieSegmentation.setOptions({
    modelSelection: 1,
  });
//   const detectorConfig = {
//     runtime: 'tfjs', // or 'mediapipe',
//   }
//   detector = await segmentation.createDetector(model, detectorConfig);
  console.log("ready");
}
init();
const {
  segment,
} = Comlink.wrap(
    new Worker(new URL('../worker/segmentation.worker.js', import.meta.url))
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

  requestAnimationFrame(landmarksContinue)
}

async function landmarks() {
  const imageData = await getImageFromVideo()
  const predictions = await segment(imageData);


  // }
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
