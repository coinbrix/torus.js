/* eslint-disable @typescript-eslint/no-var-requires */

const path = require("path");
require("ts-node").register({ project: path.resolve("tsconfig.json"), transpileOnly: true });

const register = require("@babel/register").default;

register({
  extensions: [".ts", ".js"],
  rootMode: "upward",
});

global.fetch = require("node-fetch");
