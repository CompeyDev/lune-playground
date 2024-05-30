export const luauLsp = new Deno.Command("luau-lsp", {
  args: [
    "lsp",
    `--base-luaurc=${Deno.cwd()}/lsp/.luaurc`,
    `--settings=${Deno.cwd()}/.vscode/settings.json`,
  ],
  stdin: "piped",
  stdout: "piped",
});
