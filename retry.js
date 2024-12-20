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

module.exports = { retryPublish };
