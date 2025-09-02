import { build, emptyDir } from "https://deno.land/x/dnt@0.37.0/mod.ts";
import deno from "../deno.json" with { type: "json" }

await emptyDir("./npm");

Deno.copyFileSync("LICENSE", "npm/LICENSE")
Deno.copyFileSync("README.md", "npm/README.md")

await build({
  entryPoints: ["./src/index.ts"],
  outDir: "./npm",
  typeCheck: false,
  compilerOptions: {
    lib: ['DOM', "ESNext"]
  },
  shims: {},
  package: {
    name: "@fatfish-lab/aquarium-ts-api",
    version: deno.version,
    description: "Aquarium API typescript package",
    license: "GPL-3.0",
    types: "./src/index.d.ts",
    repository: {
      type: "git",
      url: "git+https://github.com/fatfish-lab/aquarium-ts-api.git",
    },
    bugs: {
      url: "https://github.com/fatfish-lab/aquarium-ts-api/issues",
    },
    publishConfig: {
      "registry": "https://npm.pkg.github.com"
    },
  }
});