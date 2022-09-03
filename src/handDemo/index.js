import * as Comlink from 'comlink';
import { init, estimateHands } from '../worker/handpose.worker';
import './index.css';

const mobile = isMobile();

let ctx;

mainWorker()
// mainAlt()
async function mainWorker() {
  const video = await setupCamera();
  const videoWidth = video.videoWidth;
  const videoHeight = video.videoHeight;

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

function isMobile() {
  const isAndroid = /Android/i.test(navigator.userAgent);
  const isiOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  return isAndroid || isiOS;
}

async function setupCamera() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error(
      'Browser API navigator.mediaDevices.getUserMedia not available'
    );
  }

  const video = document.getElementById('video');
  video.muted = "muted";
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      facingMode: 'user',
      // Only setting the video to a specified size in order to accommodate a
      // point cloud, so on mobile devices accept the default size.
      // width: mobile ? undefined : VIDEO_WIDTH,
      // height: mobile ? undefined : VIDEO_HEIGHT
    },
  });
  video.srcObject = stream;

  return new Promise((resolve, reject) => {
    video.onloadedmetadata = () => {
      // console.log(">>> onloadedmetadat")
      video.play();
      resolve(video);
    };
  });
}

function drawKeypoints(keypoints) {
  // console.log(keypoints)
  const keypointsArray = keypoints;

  // ctx.clearRect(0, 0, 300, 400);

  for (let i = 0; i < keypointsArray.length; i++) {
    drawPoint(keypointsArray[i].x - 2, keypointsArray[i].y - 2, 3);
  }
}

function drawPoint(x, y, r) {
  // console.log('drawPoint', y, x, r)
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fill();
}
