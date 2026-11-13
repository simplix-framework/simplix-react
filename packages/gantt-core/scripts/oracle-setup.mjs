// Vitest global setup: makes sure the Microsoft Project sample files the
// differential tests read are present before any test runs.
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export default function setup() {
  execFileSync(process.execPath, [join(dirname(fileURLToPath(import.meta.url)), "fetch-oracle.mjs")], { stdio: "inherit" });
}
