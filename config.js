const rabbit = require("foo-foo-mq");
const { limit, queueLimit, retryDelay } = require("./constants");

const settings = {
  connection: {
    user: "guest",
    pass: "compro",
    host: "localhost",
    port: 5672,
    timeout: 2000,
    vhost: "%2f",
  },
  exchanges: [
    { name: "main.e1", type: "direct" },
    { name: "main.e2", type: "topic" },
    { name: "retry.e1", type: "direct" },
    { name: "dead-letter.e1", type: "fanout" },
  ],
  queues: [
    {
      name: "main.q1",
      limit: limit,
      queueLimit: queueLimit,
      deadLetter: "dead-letter.e1",
    },
    {
      name: "main.q2",
      limit: limit,
      queueLimit: queueLimit,
      deadLetter: "dead-letter.e1",
    },
    {
      name: "retry.q1",
      limit: limit,
      queueLimit: queueLimit,
      messageTtl: retryDelay,
      deadLetter: "main.e1",
    },
    {
      name: "retry.q2",
      limit: limit,
      queueLimit: queueLimit,
      messageTtl: retryDelay,
      deadLetter: "main.e2",
    },
    { name: "dead-letter.q1" },
  ],
  bindings: [
    { exchange: "main.e1", target: "main.q1", keys: ["test1"] },
    { exchange: "main.e1", target: "main.q2", keys: ["test2"] },
    { exchange: "main.e2", target: "main.q1", keys: ["test1"] },
    { exchange: "main.e2", target: "main.q2", keys: ["test2"] },
    { exchange: "retry.e1", target: "retry.q1", keys: ["test1"] },
    { exchange: "retry.e1", target: "retry.q2", keys: ["test2"] },
    { exchange: "dead-letter.e1", target: "dead-letter.q1" },
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
