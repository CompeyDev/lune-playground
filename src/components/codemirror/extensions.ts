import { basicSetup } from "codemirror";
import type { Extension } from "@codemirror/state";
import { StreamLanguage } from "@codemirror/language";
import { lua } from "@codemirror/legacy-modes/mode/lua"
import { keymap } from "@codemirror/view";
import { defaultKeymap, indentWithTab } from "@codemirror/commands";

export default function extensions(lspClients: Extension): Extension {
    return [
        basicSetup,
        StreamLanguage.define(lua),
        lspClients,
        keymap.of(defaultKeymap),
        keymap.of([indentWithTab]),
      ]
}