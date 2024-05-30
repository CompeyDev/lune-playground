import log from "./log.ts";

export default (
  luauLsp: Deno.Command,
  child: Deno.ChildProcess,
  streamHandlers: {
    encoder: TextEncoder;
    decoder: TextDecoder;
  },
) => {
  const { encoder, decoder } = streamHandlers;
  const stdinWriter = child.stdin.getWriter();
  const stdoutReader = child.stdout.getReader();

  Deno.serve({
    port: 3001,
    handler: (request) => {
      const reqId = Math.random().toString(16).substring(2, 8);

      if (request.headers.get("upgrade") === "websocket") {
        const { socket, response } = Deno.upgradeWebSocket(request);

        socket.onopen = () => log.info("Received connection!", reqId);
        socket.onclose = () => log.info("Disconnected", reqId);
        socket.onerror = (error) => log.error("Socket error:", reqId, error);

        socket.onmessage = async (event) => {
          const payload: string = event.data;
          log.info("Received payload from socket connection", reqId, payload);

          const payloadBuf = encoder.encode(
            `Content-Length: ${payload.length}\r\n\r\n${payload}`,
          );
          log.debug("Encoded LSP friendly payload buffer", reqId);

          try {
            stdinWriter.write(payloadBuf);
            log.debug("Wrote payload buffer to luau-lsp stdin", reqId);
          } catch (_) {
            log.critical(
              "luau-lsp unexpectedly exited! attempting to restart",
              reqId,
            );

            child = luauLsp.spawn();
          }

          const stdout = decoder.decode((await stdoutReader.read()).value);
          log.debug("Read and decoded luau-lsp stdout", reqId);

          const methods = stdout.split("\n");
          log.debug(
            "Parsing luau-lsp stdout and extracting JSON response",
            reqId,
          );

          const json = methods[methods.length - 1];
          log.debug("Sending JSON to client", reqId);

          try {
            socket.send(json);
          } catch (err) {
            if ((err as DOMException).message !== "readyState not OPEN") {
              log.warn(
                "Failed to send socket response back to client, trying again",
              );
              socket.send(json);
            } else {
              // TODO: Somehow cancel the send
            }
          }

          log.info("Sent JSON to client", reqId);
        };

        return response;
      }

      return new Response("Upgrade Required");
    },
  });
};
