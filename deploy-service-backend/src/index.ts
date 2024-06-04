import { commandOptions, createClient } from "redis";
import { downloadFiles } from "./r2";
import { buildProject } from "./build";
import { uploadFiles } from "./upload";

//Connect to the queue
const subscriber = createClient();
subscriber.connect();

const publisher = createClient();
publisher.connect();

async function main() {
  while (1) {
    const id = await subscriber.brPop(
      commandOptions({ isolated: true }),
      "vercel-build-queue",
      0
    );
    console.log(
      "Waiting for files to get uploaded to R2, starting download in 25 seconds"
    );
    setTimeout(async () => {
      await downloadFiles(id?.element as string);
    }, 25000);
    await buildProject(id?.element);
    console.log("Build done!");
    await uploadFiles(id?.element);
    const res = await publisher.hSet(
      "status",
      id?.element as string,
      "deployed"
    );
  }
}

main();
