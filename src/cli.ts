import cmdLineArgs from "command-line-args";
import fs from "fs";
import { MooEnvironment } from "./environment";

const optionsDef: cmdLineArgs.OptionDefinition[] = [
  { name: "file", alias: "f", type: String },
  { name: "memory", alias: "m", type: Number, defaultValue: 30000  }
];

const options = cmdLineArgs(optionsDef, {
  stopAtFirstUnknown: true
});

if (!options.file) {
  console.error("Missing file argument");
  process.exit(); 
}

if (isNaN(options.memory) || parseInt(options.memory) <= 0) {
  console.error("Invalid memory argument");
  process.exit();
}
const memory = parseInt(options.memory);

const code = fs.readFileSync(options.file, "utf8");

const env = new MooEnvironment(memory);
env.run(code);