function distance(a, b) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

function angle(c, e) {
  var dy = e.y - c.y;
  var dx = e.x - c.x;
  var theta = Math.atan2(dy, dx); // range (-PI, PI]
  // theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
  // if (theta < 0) theta = 360 + theta; // range [0, 360)
  return theta;
}

function cursorImage(){
  let cursor = new Image();
  cursor.src = "/playground/demoSite/images/pen7.png"
  return cursor
}
function drawPoint(ctx, pt, r) {
  // console.log('drawPoint', y, x, r)
  ctx.beginPath();
  ctx.arc(pt.x - r, pt.y - r, r, 0, 2 * Math.PI);
  ctx.fill();
}

function drawPath(ctx, points, closePath) {
  const region = new Path2D();

  region.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    const point = points[i];
    region.lineTo(point[0], point[1]);
  }

  if (closePath) {
    region.closePath();
  }
  ctx.stroke(region)
}

function cropImageFromCanvas(ctx) {
  var canvas = ctx.canvas,
    w = canvas.width, h = canvas.height,
    pix = {x:[], y:[]},
    imageData = ctx.getImageData(0,0,canvas.width,canvas.height),
    x, y, index;

  for (y = 0; y < h; y++) {
    for (x = 0; x < w; x++) {
      index = (y * w + x) * 4;
      if (imageData.data[index+3] > 0) {
        pix.x.push(x);
        pix.y.push(y);
      }
    }
  }
  pix.x.sort(function(a,b){return a-b});
  pix.y.sort(function(a,b){return a-b});
  var n = pix.x.length-1;

  w = 1 + pix.x[n] - pix.x[0];
  h = 1 + pix.y[n] - pix.y[0];
  var cut = ctx.getImageData(pix.x[0], pix.y[0], w, h);

  canvas.width = w;
  canvas.height = h;
  ctx.putImageData(cut, 0, 0);
  const image = new Image();
  image.src = canvas.toDataURL('image/png')
  image.width = w;
  image.height = h;
  return { img: image, top: pix.y[0], left: pix.x[0]}
}

function isMobile() {
  const isAndroid = /Android/i.test(navigator.userAgent);
  const isiOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  return isAndroid || isiOS;
}

async function setupCamera(mobile, size) {
  const VIDEO_WIDTH = size ? size.width: 640;
  const VIDEO_HEIGHT = size ? size.height: 480;
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error(
      'Browser API navigator.mediaDevices.getUserMedia not available'
    );
  }

  console.log("setting up camera")

  const video = document.getElementById('video');
  video.muted = "muted";
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: 'user',
        // Only setting the video to a specified size in order to accommodate a
        // point cloud, so on mobile devices accept the default size.
        width: mobile ? undefined : VIDEO_WIDTH,
        height: mobile ? undefined : VIDEO_HEIGHT
      },
    });
    video.srcObject = stream;
  } catch(e) {
    console.log(e);
  }

  // console.log(video.play());

  return new Promise((resolve, reject) => {
    video.onloadedmetadata = () => {
      resolve(video);
    };
  });
}

function getImageFromVideo(video) {
  const canvas = document.createElement('canvas')
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, video.videoWidth, video.videoHeight);
  ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0,
    canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, video.videoWidth, video.videoHeight)
  return imageData;
}

export {
  distance,
  angle,
  drawPoint,
  drawPath,
  isMobile,
  setupCamera,
  getImageFromVideo,
  cropImageFromCanvas,
  cursorImage
}
