/**
 * ------------------------------------------------------------------
 * Get notified when you should run some commands when switching
 * between branches.
 *
 * Usage:
 * Adjust `checkChange` function calls by putting a command as
 * the second argument, and then a list of file/folder paths
 * that you want to monitor for changes as following arguments.
 *
 * Installation:
 * 1. Install husky and chalk
 *    yarn add --dev husky chalk
 * 2. Add post-checkout hook in package.json
 *    "husky": {
 *      "hooks": {
 *        "post-checkout": "node build-check.js",
 *      }
 *    },
 * ------------------------------------------------------------------
 */

import { exec } from "child_process";
import chalk from "chalk";

const argParams = process.argv;
const gitParams = process.env.GIT_PARAMS
	? process.env.GIT_PARAMS.split(" ")
	: [];

const prev = getCommitHash(argParams[2], gitParams[0], "ORIG_HEAD");
const head = getCommitHash(argParams[3], gitParams[1], "HEAD");

const commandsToRun = [];

exec(
	`git diff-tree -r --name-only --no-commit-id ${prev} ${head}`,
	(error, stdout) => {
		if (error && error.message.includes("ambiguous argument")) {
			return;
		}

		handleError(error);

		if (!stdout) {
			return;
		}

		checkChange(stdout, "composer install", "composer.json", "composer.lock");
		checkChange(stdout, "yarn install", "package.json", "yarn.lock");
		checkChange(stdout, "yarn build", "resources/js", "resources/sass");
		checkChange(stdout, "php artisan migrate", "database/migrations");

		notifyChanges();
	}
);

function getCommitHash() {
	return Array.prototype.find.call(arguments, (arg) => {
		if (typeof arg === "string" && arg.length > 1) {
			return true;
		}
	});
}

function handleError(error) {
	if (error) {
		console.error(`${chalk.red("exec error")}: ${error}`);
		process.exit(1);
	}
}

function checkChange(changes, command, ...paths) {
	for (const path of paths) {
		if (changes.includes(path) && commandsToRun.indexOf(command) === -1) {
			commandsToRun.push(command);
			break;
		}
	}
}

function notifyChanges() {
	if (commandsToRun.length === 0) {
		return;
	}

	exec("git config user.name", (error, stdout) => {
		handleError(error);

		const hey = stdout ? stdout.split(" ")[0].trim() : "Hey";
		const log = console.log;

		log();
		log(
			`${chalk.black.bgYellow(hey)}${chalk.yellow(
				", you probably should run:"
			)}`
		);

		for (const command of commandsToRun) {
			log(chalk.green(command));
		}

		log();
	});
}
