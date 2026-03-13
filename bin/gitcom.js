#!/usr/bin/env node

import { Command } from 'commander';
import init from '../commands/init.js';
import commit from '../commands/commit.js';
import configCmd from '../commands/config.js';
import quick from '../commands/quick.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import config from '../config/config.js';
import logger from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));

const program = new Command();

program
    .name('gitcom')
    .description('AI-powered Git commit message generator')
    .version(packageJson.version, '-v, --version')
    .helpOption('-h, --help', 'Display help for command')
    .option('-r, --reset', 'Reset all configuration and keys');

program
    .command('init')
    .description('Initialize GitCom setup')
    .action(init);

program
    .command('commit')
    .description('Generate and use an AI commit message')
    .option('-y, --yes', 'Skip confirmation and commit instantly')
    .action((options) => commit(options));

program
    .command('config')
    .description('View and update GitCom configuration')
    .action(configCmd);

program
    .command('quick')
    .description('Staged everything, commit with AI message and push')
    .action(quick);

// Default command action
program.action((options) => {
    if (options.reset) {
        config.clear();
        logger.success('GitCom configuration has been reset.');
        return;
    }

    if (process.argv.length <= 2) {
        commit();
    }
});

program.parse(process.argv);
