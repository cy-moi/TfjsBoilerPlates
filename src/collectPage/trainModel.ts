"use strict";
import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";

const classes = require("./classes.json");

export const processData = (el: any[]) => {
  console.log(el, " process data");

  el = el.map((d) => Object.values(d));
  let temp = [];

  for (let d of el) temp = [...temp, ...d];
  el = [];
  for (let d of temp) el = [...el, ...d];
  // console.log(el)

  let len = 1656 - el.length;
  if (el.length < 1656) {
    let i = 0;

    while (i < len) {
      el.push(el[0]);

      i++;
    }
  }

  console.log(tf.tensor([el]).shape);
  return tf.tensor([el]);
};

export const trainModel = async (surface) => {
  let pfitdata = [];
  let plabels = [];
  let ind = 0;

  for (let cl of Object.keys(classes)) {
    // console.log(cl);
    classes[cl] =
      localStorage.getItem(cl) === null
        ? require(`./data/${cl}_washed.json`)
        : localStorage.getItem(cl);
    for (let el of classes[cl]) {
      let temp = [];

      if (el.length < 1) {
        console.log("no data for class ", cl);
        temp = el;
      }

      el = el.map((d) => Object.values(d)[0]);
      for (let d of el) temp = [...temp, ...d];

      let len = 1656 - temp.length;
      if (temp.length < 1656) {
        let i = 0;

        while (i < len) {
          temp.push(temp[i]);
          i++;
        }
      } else {
        temp = temp.slice(0, 1656);
      }

      // console.log(temp.length);

      pfitdata.push(temp);
      plabels.push(ind);
    }
    ind++;
  }

  const fitdata = tf.tensor(pfitdata);
  const labels = tf.tensor(plabels);

  console.log(fitdata.shape, labels.shape);

  const model = tf.sequential({
    layers: [
      tf.layers.dense({
        inputShape: [1656],
        units: 128,
        activation: "relu",
      }),
      tf.layers.dense({
        units: 64,
        activation: "relu",
      }),
      tf.layers.dropout({ rate: 0.5 }),

      // tf.layers.dense({
      //   units: 150,
      //   activation: "relu",
      // }),
      tf.layers.dense({ units: 5, activation: "softmax" }),
    ],
  });

  model.weights.forEach((w) => {
    console.log(w.name, w.shape);
  });

  model.compile({
    optimizer: tf.train.adam(),
    loss: "sparseCategoricalCrossentropy",
    metrics: ["accuracy"],
  });

  console.log("labels: " + labels.shape);

  function onBatchEnd(batch, logs) {
    console.log("Accuracy", logs.acc);
  }

  // Train for 5 epochs with batch size of 32.
  model.fit(fitdata, labels, {
    epochs: 25,
    // batchSize: 2,
    callbacks: tfvis.show.fitCallbacks(surface, ["loss", "acc"]),
  });
  // .then((info) => {
  //   tfvis.show.history(surface, info, ['loss', 'acc'])
  // });

  // await model.save('downloads://my-model');

  // // Predict 3 random samples.
  // const prediction = model.predict(tf.randomNormal([3, 784]));
  // prediction.print();
};
