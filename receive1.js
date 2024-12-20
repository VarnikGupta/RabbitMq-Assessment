const rabbit = require("foo-foo-mq");
const { configure } = require("./config");
const { maxRetries } = require("./constants");
const { retryPublish } = require("./retry");

async function receiveMessageOnQueue1() {
  try {
    await configure();

    await rabbit.handle("test1", (message) => handleMessage(message));

    // await rabbit.handle("test2", (message) => handleMessage(message));

    await rabbit.startSubscription("main.q1");
  } catch (err) {
    console.error("Error consuming message on queue1:", err);
  }
}

async function handleMessage(msg) {
  const message = msg.body.text;
  const retryCount = msg.body.retry_count || 0;

  try {
    if (Math.random() < 0.5) throw new Error(`Simulated failure on message ${msg.body.id}`);

    msg.ack();
    console.log(`Message ${msg.body.id} processed successfully in ${msg.body.retry_count} retries:`, message);
  } catch (err) {
    console.log(`Message ${msg.body.id} processing failed:`, message, err.message);

    if (retryCount < maxRetries) {
      msg.body.retry_count = retryCount + 1;
      msg.body.text += `${retryCount + 1}`;
      await retryPublish(msg.body);
      msg.ack();
    } else {
      console.log(`Max retries reached. Discarding message ${msg.body.id}:`, message);
      msg.reject();
    }
  }
}

receiveMessageOnQueue1();
