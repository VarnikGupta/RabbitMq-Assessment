const rabbit = require("foo-foo-mq");
const { configure } = require("./config");
const { maxRetries, mainQueue2 } = require("./constants");
const { retryPublish, handleMessage } = require("./helper");

async function receiveMessageOnQueue1() {
  try {
    await configure();

    // await rabbit.handle("test1", (message) => handleMessage(message));

    await rabbit.handle("test2", (message) => handleMessage(message));

    await rabbit.startSubscription(mainQueue2);
  } catch (err) {
    console.error("Error consuming message on queue2:", err);
  }
}

receiveMessageOnQueue1();
