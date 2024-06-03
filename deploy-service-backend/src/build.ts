import { exec } from "child_process";

export const buildProject = (id: string | undefined) => {
  return new Promise((res) => {
    const child = exec(
      `cd ./dist/output/${id} && npm install && npm run build`
    );
    child.stdout?.on("data", (data) => {
      console.log("stdout: " + data);
    });
    child.stderr?.on("data", (data) => {
      console.log("stderr: " + data);
    });

    child.on("close", () => {
      res("");
    });
  });
};
