import simpleGit from 'simple-git';
const git = simpleGit();

const EXCLUDE_PATHS = [
    ':!package-lock.json',
    ':!yarn.lock',
    ':!pnpm-lock.yaml',
    ':!node_modules',
    ':!dist',
    ':!build'
];

export async function getStagedDiff() {
    try {
        const diff = await git.diff(['--cached', '--', '.', ...EXCLUDE_PATHS]);
        return diff;
    } catch (error) {
        throw new Error('Failed to get staged diff: ' + error.message);
    }
}

export async function getDiffStat() {
    return await git.diff(['--cached', '--stat', '--', '.', ...EXCLUDE_PATHS]);
}

export async function getChangedFiles() {
    const names = await git.diff(['--cached', '--name-only', '--', '.', ...EXCLUDE_PATHS]);
    return names.trim().split('\n').filter(Boolean);
}

export function cleanDiff(diff, limit = 200) {
    if (!diff) return '';
    
    return diff
        .split('\n')
        .filter(line => line.startsWith('+') || line.startsWith('-'))
        .filter(line => !line.startsWith('+++') && !line.startsWith('---')) // Remove file markers
        .slice(0, limit)
        .join('\n');
}

export async function getOptimizedContext() {
    const files = await getChangedFiles();
    const stat = await getDiffStat();
    const rawDiff = await getStagedDiff();
    
    let context = {
        files,
        stat,
        summaryOnly: false
    };

    // Hybrid strategy:
    // If more than 5 files or raw diff is > 300 lines, use summary mode
    const diffLines = rawDiff.split('\n').length;
    
    if (files.length > 5 || diffLines > 300) {
        context.summaryOnly = true;
        context.diff = ""; // No diff for large changes
    } else {
        context.diff = cleanDiff(rawDiff);
    }

    return context;
}

export async function getStatus() {
    return await git.status();
}
