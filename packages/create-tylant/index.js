#!/usr/bin/env node

import inquirer from "inquirer";
import { execSync } from "child_process";
import fs from "fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import chalk from "chalk";

const main = async () =>
  inquirer
    .prompt([
      {
        type: "input",
        name: "blogName",
        message: "Enter name to create your blog in:",
        default: "my-blog",
      },
    ])
    .then((answers) => {
      init(answers.blogName);
    })
    .catch((error) => {
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
        console.error("Cannot render the prompt...");
      } else {
        console.error(error.message);
      }
    });

export const copyTemplateFilesAndFolders = async (
  source,
  destination,
  projectName
) => {
  const filesAndFolders = await fs.readdir(source);

  for (const entry of filesAndFolders) {
    const currentSource = path.join(source, entry);
    const destEntry = entry === ".xgitignore" ? ".gitignore" : entry;
    const currentDestination = path.join(destination, destEntry);

    const stat = await fs.lstat(currentSource);

    if (stat.isDirectory()) {
      await fs.mkdir(currentDestination);
      await copyTemplateFilesAndFolders(currentSource, currentDestination);
    } else {
      // If the file is package.json we replace the default name with the one provided by the user
      if (/package\.json/.test(currentSource)) {
        const currentPackageJson = await fs.readFile(currentSource, "utf8");
        const newFileContent = currentPackageJson.replace(
          /custom-scaffolding/g,
          projectName
        );
        // .replace(
        //   /workspace\:\^/g,
        //   `^${theVersion}`
        // ).replace(
        //   /"workspace\:="/g,
        //   `"workspace:=${theVersion}"`
        // );

        await fs.writeFile(currentDestination, newFileContent, "utf8");
      } else {
        await fs.copyFile(currentSource, currentDestination);
      }
    }
  }
};

export const init = async (projectName) => {
  const destination = path.join(process.cwd(), projectName);

  const source = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "templates/minimal"
  );

  const inDestOpts = {
    cwd: destination,
    stdio: "inherit",
  };

  let okay = false;
  try {
    console.log(chalk.blueBright(`"Copying files..."`));
    await fs.mkdir(destination);
    await copyTemplateFilesAndFolders(source, destination, projectName);
    await fs.mkdir(path.join(destination, "packages"), { recursive: true });
    console.log(chalk.greenBright("Files copied..."));

    execSync("git init", inDestOpts);
    execSync("git branch -m main", inDestOpts);
    execSync("git add .", inDestOpts);
    execSync("git commit -m 'feat: init'", inDestOpts);

    const mayFailCommands = [
      "git submodule add -b main https://github.com/Myriad-Dreamin/typ.git typ",
      "git submodule add -b main https://github.com/Myriad-Dreamin/tylant.git packages/tylant",
      "git submodule update --init --recursive",
      "pnpm install",
    ];

    console.log(
      chalk.blueBright(
        `If any of the following commands fail, you can run them manually:`
      )
    );
    const hintCmds = [`cd ${destination}`, ...mayFailCommands];
    console.log(hintCmds.map((cmd) => `\n    ${cmd}`).join(""));

    for (const cmd of mayFailCommands) {
      console.log(chalk.blueBright(`Executing: ${cmd}`));
      execSync(cmd, inDestOpts);
    }

    okay = true;
  } catch (error) {
    console.log(error);
  }

  if (okay) {
    execSync("pnpm run dev", inDestOpts);
  }
};

main();
