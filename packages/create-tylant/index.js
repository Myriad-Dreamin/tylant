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
  const theVersion = JSON.parse(
    await fs.readFile(
      path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        "package.json"
      ),
      "utf8"
    )
  ).version;

  const filesAndFolders = await fs.readdir(source);

  for (const entry of filesAndFolders) {
    const currentSource = path.join(source, entry);
    const currentDestination = path.join(destination, entry);

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

  try {
    console.log("📑  Copying files...");

    await fs.mkdir(destination);
    await copyTemplateFilesAndFolders(source, destination, projectName);

    execSync("git init", {
      cwd: destination,
      stdio: "inherit",
    });
    execSync("git branch -m main", {
      cwd: destination,
      stdio: "inherit",
    });
    execSync("git add .", {
      cwd: destination,
      stdio: "inherit",
    });
    execSync("git commit -m 'feat: init'", {
      cwd: destination,
      stdio: "inherit",
    });
    await fs.mkdir(
      path.join(destination, "packages"),
      { recursive: true }
    );

    console.log("📑  Files copied...");
    console.log(
      chalk.green(
`
cd ${projectName}
git submodule add -b main https://github.com/Myriad-Dreamin/typ.git typ
git submodule add -b main https://github.com/Myriad-Dreamin/tylant.git packages/tylant
git submodule update --init --recursive
pnpm install
pnpm run dev`
      )
    );
  } catch (error) {
    console.log(error);
  }
};

main();
