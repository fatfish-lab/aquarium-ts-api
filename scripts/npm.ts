import { build, emptyDir } from "https://deno.land/x/dnt@0.37.0/mod.ts";
import deno from "../deno.json" with { type: "json" };

await emptyDir("./npm");

Deno.copyFileSync("LICENSE", "npm/LICENSE");
Deno.copyFileSync("README.md", "npm/README.md");

await build({
  entryPoints: ["./src/mod.ts"],
  outDir: "./npm",
  test: false,
  compilerOptions: {
    lib: ["DOM", "ESNext"],
  },
  shims: {},
  package: {
    name: "@fatfish-lab/aquarium-ts-api",
    version: deno.version,
    description: "Aquarium API typescript package",
    license: "GPL-3.0",
    repository: {
      type: "git",
      url: "git+https://github.com/fatfish-lab/aquarium-ts-api.git",
    },
    bugs: {
      url: "https://github.com/fatfish-lab/aquarium-ts-api/issues",
    },
    publishConfig: {
      "registry": "https://npm.pkg.github.com",
    },
  },
  async postBuild() {
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    Deno.copyFileSync("README.md", "npm/README.md");

    async function processDirectory(dirPath: string) {
      console.log("[dnt] Fixing imports under", dirPath);
      for await (const entry of Deno.readDir(dirPath)) {
        const fullPath = `${dirPath}/${entry.name}`;
        if (entry.isDirectory) {
          await processDirectory(fullPath);
        } else if (entry.isFile && entry.name.endsWith(".d.ts")) {
          console.log("[dnt] Fixing imports in", fullPath);
          const content = await Deno.readTextFile(fullPath);
          // console.log("[dnt] Original content:", content)
          const regex = new RegExp(/\.js"/g);
          console.log("[dnt] Found .js: ", regex.test(content));
          const updatedContent = content.replace(regex, '.d.ts"');
          await Deno.writeTextFile(fullPath, updatedContent);
        }
      }
    }

    await processDirectory("./npm");
  },
});
