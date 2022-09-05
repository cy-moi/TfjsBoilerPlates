import * as Comlink from 'comlink';
import { init, estimateHands } from '../models/handpose';
import { drawPoint, isMobile, setupCamera } from './utils';
// import './index.css';

const mobile = isMobile();

let ctx;

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
  const predictions = await estimateHands(imageData, {width: video.videoWidth, height: video.videoHeight});

  ctx.clearRect(0, 0, video.videoWidth, video.videoHeight);
  ctx.globalCompositeOperation = 'source-over';
  ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0,
    video.videoWidth, video.videoHeight);

  if (predictions.length > 0) {
      drawKeypoints(predictions[0].keypoints);
    }
  // }
}

function findClosestResult(landmarks, curLd){
  return (landmarks[0][0][0] - curLd[0][0])**2 + (landmarks[0][0][1] - curLd[0][1])**2
          > (landmarks[1][0][0] - curLd[1][0])**2 + (landmarks[1][0][1] - curLd[1][1])**2 ? 0 : 1;
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


function drawKeypoints(keypoints) {
  // console.log(keypoints)
  const keypointsArray = keypoints;

  // ctx.clearRect(0, 0, 300, 400);

  for (let i = 0; i < keypointsArray.length; i++) {
    drawPoint(ctx, keypointsArray[i], 3);
  }
}
