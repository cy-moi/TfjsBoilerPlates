const tf = require("@tensorflow/tfjs");
const classes = require("./classes.json");

(async () => {
  let pfitdata = [];
  let plabels = [];
  let ind = 0;


  for (let cl of Object.keys(classes)) {
    console.log(cl);
    classes[cl] = require(`./${cl}_washed.json`);
    for (let el of classes[cl]) {
      el = el.map((d) => Object.values(d)[0]);
      let temp = [];
      for(let d of el) temp = [...temp, ...d];

      let len = 1656 - temp.length;      
      if(temp.length < 1656) {
        let i = 0;
        
        while( i < len) {
          temp.push(temp[i])
          i++;
        }
      } else {
        temp = temp.slice(0, 1656)
      }

      console.log(temp.length)

      pfitdata.push(temp);
      plabels.push(ind);
    }
    ind++;
  }


  const fitdata = tf.tensor(pfitdata);
  const labels = tf.tensor(plabels);
  fitdata.print();

  console.log(fitdata.shape, labels.shape)


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
      tf.layers.dropout({rate: 0.5}),

      // tf.layers.dense({
      //   units: 150,
      //   activation: "relu",
      // }),
      tf.layers.dense({ units: 4, activation: "softmax" }),
    ],
  });

  model.weights.forEach(w => {
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
  model
    .fit(fitdata, labels, {
      epochs: 20,
      // batchSize: 2,
      callbacks: { onBatchEnd },
    })
    .then((info) => {
       console.log('Final accuracy', info.history.acc);
    });

  // await model.save('downloads://my-model');

  // // Predict 3 random samples.
  // tf.randomNormal([1656]).print()
  // console.log("prediction")
  // const prediction = model.predict( tf.randomNormal([1, 1656]));
  // prediction.print();
})()
