const rabbit = require("foo-foo-mq");

async function retryPublish(args) {
  const { text, routingKey, exchange } = args;

  try {
    await rabbit.publish("retry.e1", {
      body: args,
      routingKey: routingKey,
    });

    console.log(
      `Message ${args.id} sent successfully to exchange retry with key "${routingKey}":`,
      text
    );
  } catch (error) {
    console.log(
      `Error publishing message ${args.id} to exchange retry with key "${routingKey}":`,
      error.message
    );
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
      // msg.body.text += `${retryCount + 1}`;
      await retryPublish(msg.body);
      msg.ack();
    } else {
      console.log(`Max retries reached. Discarding message ${msg.body.id}:`, message);
      msg.reject();
    }
  }
}

module.exports = { retryPublish, handleMessage };
