import {redis} from "../src/lib/redis.js";

const channel = 'demo:notifications';

async function run() {
  const publisher = redis.duplicate();
  const subscriber = redis.duplicate();

  await Promise.all([publisher.connect(), subscriber.connect(),])
  console.log("publisher connected")
  console.log("subscriber connected")
  console.log('published ping', await publisher.ping())
  console.log('subscriber ping', await subscriber.ping())

  await subscriber.subscribe(channel, (message) => {
    const data = JSON.parse(message);
    console.log('received message', data);
  })

  console.log('subscribed to channel:', channel)

  console.log('publisher is now sending event')

  const event = {
    message: 'Hello from publisher',
    timestamp: new Date().toISOString(),
  }

  const receivers = await publisher.publish(channel, JSON.stringify(event));
  console.log('published event')
  console.log('receivers:', receivers)

  await new Promise(resolve => setTimeout(resolve, 1000));

  await subscriber.unsubscribe(channel);
  console.log('unsubscribed from channel:', channel)

  await subscriber.quit();
  await publisher.quit();

  console.log('pub/sub demo done')
}

run();