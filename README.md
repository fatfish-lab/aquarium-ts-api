# Aquarium API typescript module

![aquarium-ts-logo](https://storage.googleapis.com/fatfishlab-public/aquarium-studio-website/aquarium-ts-logo.png)

> Aquarium typescript API is a tool that allows [Aquarium Studio](https://fatfi.sh/aquarium) users to interact with there data from directly from JS.

[Full API documentation is available here](https://documenter.getpostman.com/view/24180587/2s93Xzw28w).

Aquarium Studio is developed by [Fatfish Lab](https://fatfi.sh)

> This package is still in early access. Open issues or contact our [support team](mailto:support@fatfi.sh) if you are looking for more functions.

```js

import Aquarium from '@fatfish-lab/aquarium-ts-api'

const aq = new Aquarium('https://your-aquarium-server.com')

await aq.signin(AQ_USER, AQ_PASSWORD)

```

## Installation

### NPM

`npm install --save-dev @fatfish-lab/aquarium-ts-api`

### Deno

`import Aquarium from https://github.com/fatfish-lab/aquarium-ts-api/blob/main/index.ts`

## Development

### Build and publish for npm

```
deno run -A scripts/npm.ts 0.0.1
cd npm
npm publish
```