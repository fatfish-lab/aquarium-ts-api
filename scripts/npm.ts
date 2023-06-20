import { build, emptyDir } from "https://deno.land/x/dnt@0.37.0/mod.ts";

const newTag = new Deno.Command('git', {
    args: ['tag', '-a', `${Deno.args[0]}`, '-m', `v${Deno.args[0]}`]})
newTag.outputSync()

await emptyDir("./npm");

Deno.copyFileSync("LICENSE", "npm/LICENSE")
Deno.copyFileSync("README.md", "npm/README.md")

await build({
    entryPoints: ["./src/index.ts"],
    outDir: "./npm",
    typeCheck: false,
    test: false,
    declaration: "inline",
    scriptModule: false,
    compilerOptions: {
        lib: ['DOM']
    },
    shims: {},
    package: {
        name: "@fatfish-lab/aquarium-ts-api",
        version: Deno.args[0],
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
            "registry": "https://npm.pkg.github.com"
        },
    }
});