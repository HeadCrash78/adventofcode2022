import { getInputDataLines } from '../common/helpers';

interface File {
    size: Number
}

interface Directory {
    parentDir: Directory | undefined,
    name: string,
    sizeOfSubTree: number,
    fileSizeTotal: number,
    dirs: { [key: string]: Directory } | undefined,
    files: { [key: string]: File } | undefined
}

const commandRegex = /^\$\s+(?<command>cd|ls)(?:\s+(?<arg>.+))?$/;
const itemRegex = /^(?<type>dir|\d+)\s+(?<name>.+)$/;

function populateSubTreeSizes(dir: Directory): number {
    dir.sizeOfSubTree = dir.fileSizeTotal;
    if (dir.dirs) {
        Object.keys(dir.dirs).forEach(name => dir.sizeOfSubTree += populateSubTreeSizes(dir.dirs![name]))
    }
    return dir.sizeOfSubTree;
}

function buildFileSystem(lines: string[]): Directory {
    let rootDir: Directory = {
        parentDir: undefined,
        name: '/',
        sizeOfSubTree: 0,
        fileSizeTotal: 0,
        dirs: undefined,
        files: undefined
    };
    let currentDir: Directory | undefined = rootDir;
    
    let match: RegExpMatchArray | null;
    lines.forEach(line => {
        if (match = line.match(commandRegex)) {
            let arg = match!.groups!.arg;
            // ls command is ignored when building the file system
            switch(match!.groups!.command) {
                case 'cd':
                    switch (arg) {
                        case '/':
                            currentDir = rootDir;
                            break;
                        case '..':
                            currentDir = currentDir!.parentDir;
                            break;
                        default:
                            if (!currentDir?.dirs || Object.keys(currentDir.dirs).indexOf(arg) < 0) {
                                console.log(`ERROR: cd '${arg}' - no such directory`);
                            } else {
                                currentDir = currentDir.dirs[arg];
                            }
                    }
                    break;
            }
        }
        if (!match && (match = line.match(itemRegex))) {
            let name = match!.groups!.name;
            switch (match!.groups!.type) {
                case 'dir':
                    if (!currentDir!.dirs) {
                        currentDir!.dirs = {};
                    }
                    if (Object.keys(currentDir!.dirs).indexOf(name) < 0) {
                        currentDir!.dirs[name] = {
                            parentDir: currentDir,
                            name: name,
                            sizeOfSubTree: 0,
                            fileSizeTotal: 0,
                            dirs: undefined,
                            files: undefined
                        };
                    }
                    break;
                default:
                    let size = Number(match!.groups!.type);
                    if (!currentDir!.files) {
                        currentDir!.files = {};
                    }
                    currentDir!.files[name] = { size: size };
                    currentDir!.fileSizeTotal += size;
            }
        }
    });
    populateSubTreeSizes(rootDir);

    return rootDir;
}

function getDirsWithMaxSize(dir: Directory, maxSize: number): Directory[] {
    let result: Directory[] = [];
    if (dir.sizeOfSubTree <= maxSize) {
        result.push(dir);
    }
    if (dir.dirs) {
        Object.keys(dir.dirs).forEach(name => result.push(...getDirsWithMaxSize(dir.dirs![name], maxSize)));
    }
    return result;
}

function findSmallestDirLargerThan(dir: Directory, minSize: number): Directory | undefined {
    if (dir.sizeOfSubTree < minSize) {
        return undefined;
    }

    let smallestDir = dir;
    if (dir.dirs) {
        Object.keys(dir.dirs).forEach(name => {
            let smallestInSubDirs = findSmallestDirLargerThan(dir.dirs![name], minSize);
            if (smallestInSubDirs && smallestInSubDirs.sizeOfSubTree < smallestDir.sizeOfSubTree) {
                smallestDir = smallestInSubDirs;
            }
        });
    }

    return smallestDir;
}

function getFullDirName(dir: Directory): string {
    let path = '';
    if (dir.parentDir) {
        return `${getFullDirName(dir.parentDir)}/${dir.name}`;
    }
    return '';
}

const inputData = getInputDataLines();
let rootDir = buildFileSystem(inputData);

const maxDirSize = 100000;
let totalSizeOfDirsWithMaxSize = getDirsWithMaxSize(rootDir, maxDirSize).reduce<number>((val, d) => val += d.sizeOfSubTree, 0);
console.log(`The total size of all directories with max size of ${maxDirSize} is ${totalSizeOfDirsWithMaxSize}.`);

const maxDiskSize = 70000000;
const neededFreeSpace = 30000000;
let spaceToFreeUp = Math.max(0, neededFreeSpace - (maxDiskSize - rootDir.sizeOfSubTree));
if (spaceToFreeUp > 0) {
    let dirToDelete = findSmallestDirLargerThan(rootDir, spaceToFreeUp);
    if (dirToDelete) {
        let fullDirName = getFullDirName(dirToDelete);
        console.log(`The smallest directory to delete is ${fullDirName} with size of ${dirToDelete.sizeOfSubTree}.`);
    } else {
        console.log('No directory found that is large enough to free up enough space.')
    }
} else {
    console.log(`The free disk space of ${maxDiskSize - rootDir.sizeOfSubTree} is already large enough.`)
}