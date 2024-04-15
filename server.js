//import modules
const fs = require('fs');
const express = require("express");
const { fork } = require('child_process');

const CronJob = require("node-cron");

let coinData = {}

const initCronJobFunction = CronJob.schedule("*/1 * * * * *", async () => {
  try {
    console.log("I'm executed on a schedule!", new Date().toLocaleString());
    fs.writeFile('data.json', JSON.stringify(coinData), (err) => {
      if (err) {
        console.error('Error writing file:', err);
        return;
      }
      console.log('JSON data has been saved to data.json');
    });
  } catch (err) { console.error(err) }
}, {
  scheduled: false,
});

initCronJobFunction.start();

const app = express();

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to idonethis application." });
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

const stocksProcess = fork('./coin_script/stocks');
stocksProcess.on('message', (param) => {
  coinData["Stocks"] = param
})

const forexProcess = fork('./coin_script/forex');
forexProcess.on('message', (param) => {
  coinData["FOREX"] = param
})

const indexProcess = fork('./coin_script/index');
indexProcess.on('message', (param) => {
  coinData["INDEX"] = param
})

const cryptoProcess = fork('./coin_script/crypto');
cryptoProcess.on('message', (param) => {
  coinData["Crypto"] = param
})

const commodityProcess = fork('./coin_script/commodity');
commodityProcess.on('message', (param) => {
  coinData["COMMODITY"] = param
})