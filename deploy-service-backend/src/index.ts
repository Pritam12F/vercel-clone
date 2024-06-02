import { commandOptions, createClient } from "redis";
import { downloadFiles } from "./r2";

//Connect to the queue
const queueClient = createClient();
queueClient.connect();

async function main() {
  while (1) {
    const id = await queueClient.brPop(
      commandOptions({ isolated: true }),
      "vercel-build-queue",
      0
    );

    if (id?.element) {
      downloadFiles(id.element);
    }
  }
}

main();
