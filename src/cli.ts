import cmdLineArgs from "command-line-args";
import fs from "fs";

const optionsDef: cmdLineArgs.OptionDefinition[] = [
  { name: "file", alias: "f", type: String },
  { name: "memory", alias: "m", type: Number, defaultValue: 30000  },
  { name: "output", alias: "o", type: String, defaultValue: null }
];

const options = cmdLineArgs(optionsDef, {
  stopAtFirstUnknown: true
});

if (!options.file) {
  console.log("Missing file argument");
  process.exit(); 
}