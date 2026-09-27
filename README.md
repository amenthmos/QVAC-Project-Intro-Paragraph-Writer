# QVAC Project Intro Paragraph Writer

Describe a project — what it does and who it's for — and an on-device AI writes a polished README intro paragraph grounded in that description. No cloud call, no API key.

## Run

```bash
npm install
npm start
```

Then open http://localhost:32003

## Example

Input:

> a CLI tool that converts CSV files to JSON, built for developers who work with data pipelines

Output:

> This command-line interface (CLI) tool is designed to simplify the process of converting CSV files to JSON, a fundamental data format used in various data pipelines and applications. For developers who spend their days navigating complex data workflows and pipeline scripts, the need for efficient data transformation tools is a common concern. By providing a straightforward and easy-to-use solution, this tool enables developers to quickly and accurately convert CSV files to JSON, making it an essential tool in their toolkit for data processing and analysis.

## QVAC SDK version

`@qvac/sdk` ^0.19.0 (see `package.json`).

## How it works

Built on [Tether's QVAC SDK](https://www.npmjs.com/package/@qvac/sdk) — all inference runs on-device, no cloud call, no API key. The app loads `LLAMA_3_2_1B_INST_Q4_0` locally with `loadModel()`, generates with `completion()` (streamed via `tokenStream`), and releases the model with `unloadModel()` on shutdown.

## License

MIT
