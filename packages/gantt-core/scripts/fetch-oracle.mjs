#!/usr/bin/env node
// Fetches the MS Project XML files the differential tests compare against.
//
// The files were saved by Microsoft Project itself (junit/GenerateTestData.bas
// in the MPXJ repository drives it) and carry the dates and slack it computed.
// MPXJ is LGPL-2.1, so the files are fetched at a pinned commit into an
// ignored directory and are never committed or published with this package.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const REPOSITORY = "https://github.com/joniles/mpxj.git";
const COMMIT = "4982974b2594ffc7146cdb9ebdf2ae46186737ca";
const PATHS = ["/LICENSE", "/junit/GenerateTestData.bas", "/junit/data/generated/**/*-mspdi.xml"];

const target = join(dirname(fileURLToPath(import.meta.url)), "..", ".oracle", "mpxj");
const stamp = join(target, ".commit");

if (existsSync(stamp) && readFileSync(stamp, "utf8").trim() === COMMIT) {
  console.log(`oracle files present at ${COMMIT}`);
  process.exit(0);
}

mkdirSync(target, { recursive: true });
const git = (...args) => execFileSync("git", args, { cwd: target, stdio: "inherit" });
if (!existsSync(join(target, ".git"))) {
  git("init", "-q", ".");
  git("remote", "add", "origin", REPOSITORY);
}
git("sparse-checkout", "init", "--no-cone");
git("sparse-checkout", "set", ...PATHS);
git("fetch", "-q", "--depth", "1", "--filter=blob:none", "origin", COMMIT);
git("checkout", "-q", "FETCH_HEAD");
writeFileSync(stamp, `${COMMIT}\n`);
console.log(`oracle files fetched at ${COMMIT}`);
