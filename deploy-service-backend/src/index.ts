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
    await downloadFiles(id?.element as string);
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
