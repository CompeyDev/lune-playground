import { WebSocketTransport } from "@open-rpc/client-js";
import { languageServerWithTransport, LanguageServerClient } from "codemirror-languageserver";

export default function getClient(sock: WebSocketTransport, documentUri: string) {
    return languageServerWithTransport({
        rootUri: "file:///tmp",
        transport: sock,
        client: new LanguageServerClient({
          transport: sock,
          workspaceFolders: null,
          languageId: "lua",
          rootUri: "file:///tmp",
          documentUri
        }),
        documentUri,
        workspaceFolders: null,
        languageId: "lua",
      });
}