import { createClient } from "redis";

//Connect to the queue
const queueClient = createClient();
queueClient.connect();

while (queueClient) {
  const id = queueClient.rPop("vercel-build-queue");
}
