import './style.css';
import * as Comlink from 'comlink';
import * as utils from './utils';
import React from 'react';
import { render } from 'react-dom';
import SketchExample from './sketchPicher';

const VIDEO_WIDTH = 640;
const VIDEO_HEIGHT = 480;
const GREEN = '#32EEDB';
const RED = '#FF2C35';
const BLUE = '#157AB3';
const NUM_KEYPOINTS = 467;
const NUM_IRIS_KEYPOINTS = 5;
let DRAWN_STICKERS = []

const mobile = utils.isMobile();

let video,canvas,ctx;
let color;
let drawSticker = new Path2D();
let eyeWidth, noseHeight;
let face_origin;
let faceAngle = 0;


let AppRef;
const setAppRef = app => AppRef = app;
const buttonContainer = document.getElementById('button');

render(
  (
    <div className='bottom'>
      <SketchExample onRef={setAppRef}/>
      <button size="small" className='util' onClick={back}>Undo</button>
      <button size="small" onClick={clear}>Clear</button>
    </div>
  ),
  buttonContainer
);

main()
const {
  init, estimateFaces,
} = Comlink.wrap(
    new Worker(new URL('../worker/facelandmarks.worker.js', import.meta.url))
  );


export async function main() {
  console.log(navigator.platform)
  video = await utils.setupCamera(mobile, {width: VIDEO_WIDTH, height: VIDEO_HEIGHT});
  video.play();
  const { videoWidth, videoHeight } = video;
  console.log(`${videoWidth} x ${videoHeight}`);

  canvas = document.getElementById('output');
  canvas.width = videoWidth;
  canvas.height = videoHeight;
  ctx = canvas.getContext('2d');
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mousedown', setPosition);
  canvas.addEventListener('mouseenter', setPosition);
  canvas.addEventListener('mouseup', saveDrawing);
  await init()
  requestAnimationFrame(estimateContinue);
}


async function estimateContinue() {
  color = `rgba(${ AppRef.state.color.r }, ${ AppRef.state.color.g }, ${ AppRef.state.color.b }, ${ AppRef.state.color.a })`
  const imageData = await utils.getImageFromVideo(video)
  const predictions = await estimateFaces(imageData);
  ctx.clearRect(0, 0, video.videoWidth, video.videoHeight);
  ctx.drawImage(video, 0, 0)

  if (predictions.length > 0) {
    let prediction = predictions[0]
    const keypoints = prediction.keypoints;


    if (prediction.box) {
      // console.log(keypoints);
      const leftCenter = keypoints.find(pt => pt.name === 'leftEye')

      // if (keypoints.length > NUM_KEYPOINTS + NUM_IRIS_KEYPOINTS) {
      const rightCenter = keypoints.find(pt => pt.name === 'rightEye')

      face_origin = keypoints.find(pt => pt.name === 'faceOval');

      eyeWidth = utils.distance(leftCenter, rightCenter) * 2;
      noseHeight = utils.distance(keypoints[168], keypoints[164]);

      // get face angle from eye line
      // the angle between eye line and the horizon
      faceAngle = utils.angle(leftCenter, rightCenter)

      for(let sticker of DRAWN_STICKERS) {
        const dw = eyeWidth * sticker.widthCoef;
        const dh = noseHeight * sticker.heightCoef;
        const rleft = eyeWidth * sticker.relative[0];
        const rtop = noseHeight * sticker.relative[1];

        ctx.translate(face_origin.x, face_origin.y)
        ctx.rotate(faceAngle - sticker.angle)
        ctx.drawImage(sticker.image, rleft, rtop, dw, dh)
        ctx.rotate(-faceAngle + sticker.angle)
        ctx.translate(-face_origin.x, -face_origin.y)
      }
      // }
    }
  }

  requestAnimationFrame(estimateContinue)
}

var pos = { x: 0, y: 0 };


function setPosition(e) { // set new mouse position
  let rect = canvas.getBoundingClientRect();
  pos.x = e.clientX - rect.left;
  pos.y = e.clientY - rect.top;
}

function draw(e) {
  // mouse left button must be pressed
  if (e.buttons !== 1) return;
  ctx.strokeStyle = color;
  ctx.lineWidth = 5
  drawSticker.lineWidth = 5;
  drawSticker.lineCap = 'round';
  drawSticker.strokeStyle = '#c0392b';

  drawSticker.moveTo(pos.x, pos.y); // from
  setPosition(e);
  drawSticker.lineTo(pos.x, pos.y); // to
  ctx.stroke(drawSticker);
}

function saveDrawing() {
  pos.x = 0;
  pos.y = 0;
  // console.log("saving")
  let sticker = {
    image: new Image(),
    widthCoef: 1,
    angle: 0
  };
  const canv = document.createElement('canvas')
  canv.width = video.videoWidth;
  canv.height = video.videoHeight;

  const ct = canv.getContext('2d')
  ct.strokeStyle = color;
  console.log(drawSticker.strokeStyle)
  ct.lineWidth = 5
  ct.stroke(drawSticker);

  const drawInfo = utils.cropImageFromCanvas(ct);
  sticker.image = drawInfo.img
  if(faceAngle) sticker.angle = faceAngle
  if(eyeWidth) {
    sticker.widthCoef = sticker.image.width/eyeWidth;
    sticker.heightCoef = sticker.image.height/noseHeight;
  }
  sticker.relative = [(drawInfo.left - face_origin.x)/eyeWidth, (drawInfo.top - face_origin.y)/noseHeight];
  DRAWN_STICKERS.push(sticker);
  drawSticker = new Path2D()
}

function back(){
  // console.log('undo')
  if(DRAWN_STICKERS.length){
    DRAWN_STICKERS.pop()
  }
};

function clear(){
  // console.log('clear')
  DRAWN_STICKERS = []
}