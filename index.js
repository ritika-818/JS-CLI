#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const UglifyJS = require('uglify-js');

function showHelp() {
  console.log(`
Description:

Bundle is a script to concatenate multiple JavaScript files into one bundled file.

Usage:

bundle <options> [list of source JavaScript files]

Options:

--minify: Removes all unnecessary characters from JavaScript source code without altering its functionality.
--out: Specifies the path of the output bundled file.
  `);
}

function bundleFiles(filePaths, outputPath, shouldMinify) {
  let bundledContent = '';

  filePaths.forEach(filePath => {
    const content = fs.readFileSync(filePath, 'utf-8');
    bundledContent += content + '\n';
  });

  if (shouldMinify) {
    const minifiedResult = UglifyJS.minify(bundledContent);
    bundledContent = minifiedResult.code;
  }

  fs.writeFileSync(outputPath, bundledContent, 'utf-8');
  console.log(`Bundled file created at: ${outputPath}`);
}

function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help')) {
    showHelp();
    return;
  }

  let shouldMinify = false;
  let outputPath = '';
  const filePaths = [];

  args.forEach((arg, index) => {
    if (arg === '--minify') {
      shouldMinify = true;
      outputPath = args[index + 1];
    } else if (arg === '--out') {
      outputPath = args[index + 1];
    } else if (index === 0 || args[index - 1] !== '--out' || args[index - 1] !== '--minify') {
      if (arg !== outputPath) {
        filePaths.push(arg);
      }
    }
  });

  if (filePaths.length === 0) {
    console.error('No source files provided.');
    showHelp();
    return;
  }

  if (!outputPath) {
    console.error('No output file specified.');
    showHelp();
    return;
  }

  bundleFiles(filePaths, outputPath, shouldMinify);
}

main();
