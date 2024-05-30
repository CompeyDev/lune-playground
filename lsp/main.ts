/// <reference lib="deno.ns" />

import log from "./log.ts";
import { luauLsp } from "./luauLsp.ts";
import socket from "./socket.ts";

function main() {
  const child = luauLsp.spawn();

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  try {
    socket(luauLsp, child, {
      encoder,
      decoder,
    });
  } catch (err) {
    log.error("Uncaught error:", err);
  }
}

main();
