#!/usr/bin/env node

import { Command } from 'commander';
import init from '../commands/init.js';
import commit from '../commands/commit.js';
import settings from '../commands/settings.js';
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
    .version(packageJson.version)
    .option('-r, --reset', 'Reset all configuration and keys');

program
    .command('init')
    .description('Initialize GitCom setup')
    .action(init);

program
    .command('commit')
    .description('Generate and use an AI commit message')
    .action(commit);

program
    .command('settings')
    .description('View and update GitCom settings')
    .action(settings);

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
