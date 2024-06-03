import { commandOptions, createClient } from "redis";
import { downloadFiles } from "./r2";
import { buildProject } from "./build";

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

    await downloadFiles(id?.element);
    await buildProject(id?.element);
  }
}

main();
