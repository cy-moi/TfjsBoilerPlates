// import * as Comlink from 'comlink';
// import { drawPoint, isMobile, setupCamera } from '../utils';
// import { HandWorker } from 'src/worker/handpose.worker';

// const mobile = isMobile();

// let ctx;
// declare let video;

// console.log(__dirname)
// const worker : Comlink.Remote<HandWorker> = Comlink.wrap(
//     new Worker(new URL(`../worker/handpose.worker.ts`, import.meta.url))
// );

// setupCamera(mobile).then((vid) => {
//   video = vid;
//   mainWorker()
// })

// // mainAlt()
// async function mainWorker() {
//   video.play();
//   const { videoWidth, videoHeight } = video;
//   console.log(`${videoWidth} x ${videoHeight}`);

//   await worker.init();

//   const canvas = document.getElementById('output') as HTMLCanvasElement;
//   canvas.width = video.videoWidth;
//   canvas.height = video.videoHeight;

//   ctx = canvas.getContext('2d');
//   ctx.strokeStyle = 'red';
//   ctx.fillStyle = 'red';
//   ctx.clearRect(0, 0, videoWidth, videoHeight);

//   requestAnimationFrame(landmarksContinue)
// }

// async function landmarks() {
//   const imageData = await getImageFromVideo()
//   const predictions = await worker.estimateHands(imageData);

//   ctx.clearRect(0, 0, video.videoWidth, video.videoHeight);
//   ctx.globalCompositeOperation = 'source-over';
//   ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0,
//     video.videoWidth, video.videoHeight);

//   if (predictions.length > 0) {
//       drawKeypoints(predictions[0].keypoints);
//     }
//   // }
// }

// async function landmarksContinue() {
//   await landmarks();
//   requestAnimationFrame(landmarksContinue)
// }

// async function getImageFromVideo() {
//   const video = document.getElementById('video') as HTMLVideoElement;
//   const canvas = document.createElement('canvas') as HTMLCanvasElement;
//   canvas.width = video.videoWidth;
//   canvas.height = video.videoHeight;
//   const ctx = canvas.getContext('2d');
//   ctx.clearRect(0, 0, video.videoWidth, video.videoHeight);
//   ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0,
//     canvas.width, canvas.height);
//   const imageData = ctx.getImageData(0, 0, video.videoWidth, video.videoHeight)
//   return imageData;
// }


// function drawKeypoints(keypoints) {
//   // console.log(keypoints)
//   const keypointsArray = keypoints;

//   for (const keypoint of keypointsArray) {
//     drawPoint(ctx, keypoint, 3);
//   }
// }
