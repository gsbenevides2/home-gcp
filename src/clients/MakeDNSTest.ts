import { randomUUIDv7 } from "bun";
import { spawn } from "node:child_process";
import { Logger } from "../logger/index.ts";

function nodeSpawn(command: string) {
  const child = spawn(command, { shell: true });
  let result = "";
  return new Promise<string>((resolve, reject) => {
    child.stdout.on("data", (data) => {
      result += data.toString();
    });
    child.stderr.on("data", (data) => {
      reject(data.toString());
    });
    child.on("close", () => resolve(result));
  });
}
async function runDigCommand(domain: string, ns: string, tracerId: string) {
  try {
    const result = await nodeSpawn(`/usr/bin/dig ${domain} @${ns} +short CNAME`);

    return result.split("\n")[0];
  } catch (error) {
    Logger.error("MakeDNSTest", "Error running dig command:", error, tracerId);
    return null;
  }
}

async function getNSRecords(domain: string) {
  const result = await nodeSpawn(`/usr/bin/dig ${domain} +short NS`);
  return result.split("\n").filter((line) => line.trim() !== "");
}

export async function makeDNSTest(domain: string, expectedCname: string, nsDomain: string): Promise<boolean> {
  let testResult = false;
  const tracerId = randomUUIDv7();
  const nsRecords = await getNSRecords(nsDomain);
  for (const ns of nsRecords) {
    Logger.info(
      "MakeDNSTest",
      `Checking DNS records`,
      {
        domain,
        ns,
      },
      tracerId
    );
    const cname = await runDigCommand(domain, ns, tracerId);
    if (cname === null) {
      Logger.error(
        "MakeDNSTest",
        "Error running dig command:",
        {
          domain,
          ns,
        },
        tracerId
      );
      return false;
    }
    if (cname === expectedCname) {
      Logger.info(
        "MakeDNSTest",
        `Test passed`,
        {
          domain,
          ns,
        },
        tracerId
      );
      testResult = true;
      break;
    }
  }
  if (!testResult) {
    Logger.info(
      "MakeDNSTest",
      `Test failed`,
      {
        domain,
      },
      tracerId
    );
  }
  return testResult;
}
