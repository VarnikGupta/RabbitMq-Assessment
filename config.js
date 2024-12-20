const rabbit = require("foo-foo-mq");
const { limit, queueLimit, retryDelay, port, mainExchange1, mainExchange2, retryExchange, deadLetterExchange, mainQueue1, mainQueue2, retryQueue1, retryQueue2, deadLetterQueue } = require("./constants");

const settings = {
  connection: {
    user: "guest",
    pass: "compro",
    host: "localhost",
    port: port,
    timeout: 2000,
    vhost: "%2f",
  },
  exchanges: [
    { name: mainExchange1, type: "direct" },
    { name: mainExchange2, type: "topic" },
    { name: retryExchange, type: "direct" },
    { name: deadLetterExchange, type: "fanout" },
  ],
  queues: [
    {
      name: mainQueue1,
      limit: limit,
      queueLimit: queueLimit,
      deadLetter: deadLetterExchange,
    },
    {
      name: mainQueue2,
      limit: limit,
      queueLimit: queueLimit,
      deadLetter: deadLetterExchange,
    },
    {
      name: retryQueue1,
      limit: limit,
      queueLimit: queueLimit,
      messageTtl: retryDelay,
      deadLetter: mainExchange1,
    },
    {
      name: retryQueue2,
      limit: limit,
      queueLimit: queueLimit,
      messageTtl: retryDelay,
      deadLetter: mainExchange2,
    },
    { name: deadLetterQueue },
  ],
  bindings: [
    { exchange: mainExchange1, target: mainQueue1, keys: ["test1"] },
    { exchange: mainExchange1, target: mainQueue2, keys: ["test2"] },
    { exchange: mainExchange2, target: mainQueue1, keys: ["test1"] },
    { exchange: mainExchange2, target: mainQueue2, keys: ["test2"] },
    { exchange: retryExchange, target: retryQueue1, keys: ["test1"] },
    { exchange: retryExchange, target: retryQueue1, keys: ["test2"] },
    { exchange: deadLetterExchange, target: deadLetterQueue },
  ],
};

async function configure() {
  await rabbit
    .configure(settings)
    .then(() => {
      console.log("configured");
    })
    .catch((err) => {
      console.log(err);
    });
}

module.exports = { configure };
