const rabbit = require("foo-foo-mq");
const { configure } = require("./config");

async function publishMessages(args) {
  console.log("publish main");
  const { text, routingKey, exchange } = args;

  try {
    await rabbit.publish(exchange, {
      body: args,
      routingKey: routingKey,
    });

    console.log(
      `Message sent successfully to exchange "${exchange}" with key "${routingKey}":`,
      text
    );
  } catch (error) {
    console.error(
      `Error publishing message to exchange "${exchange}" with key "${routingKey}":`,
      error.message
    );
  }
}

async function sendMessage(mssgs) {
  try {
    await configure();
    await publishMessages(mssgs);
  } catch (err) {
    console.error("Error sending message:", err);
  }
}

const messages = [
  {
    text: "Hello, World!",
    routingKey: "test1",
    exchange: "main.e1",
    retry_count: 0,
    id: Math.floor(Math.random() * 1000000),
  },
  {
    text: "Hello again!",
    routingKey: "test2",
    exchange: "main.e2",
    retry_count: 0,
    id: Math.floor(Math.random() * 1000000),
  },
  {
    text: "Goodbye, World!",
    routingKey: "test2",
    exchange: "main.e1",
    retry_count: 0,
    id: Math.floor(Math.random() * 1000000),
  },
  {
    text: "Goodbye, again!",
    routingKey: "test1",
    exchange: "main.e2",
    retry_count: 0,
    id: Math.floor(Math.random() * 1000000),
  },
];

messages.forEach((message, index) => {
  setTimeout(() => {
    sendMessage(message);
  }, index*2000);
});
