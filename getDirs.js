import fsPromises from "fs/promises";
import fs from "fs";
import { resolve } from "path";

const getDirSize = async (dirPath) => {
    if (!(await fsPromises.stat(dirPath)).isDirectory()) {
        throw new Error(
            "Переданный путь не относится к папке или не существует"
        );
    }

    const fileNames = await fsPromises.readdir(dirPath);
    let size = 0;

    await Promise.all(
        fileNames.map(async (fileName) => {
            const filePath = resolve(dirPath, fileName);

            try {
                const stat = await fsPromises.stat(filePath);

                size += stat.isFile() ? stat.size : await getDirSize(filePath);
            } catch (e) {
                return;
            }
        })
    );

    return size;
};

export const getDirs = async ({ root, dirName, exceptions }) => {
    const getDirsRecursive = async (dirPath) => {
        try {
            await fsPromises.stat(dirPath);
        } catch (e) {
            throw new Error("Переданная папка не существует");
        }

        try {
            await fsPromises.access(
                dirPath,
                fs.constants.R_OK | fs.constants.W_OK
            );
        } catch (e) {
            console.log(dirPath);
            console.error(e);
            return [];
        }

        const dataFilePath = resolve("node-modules-pathes.json");
        const fileNames = await fsPromises.readdir(dirPath);
        const dirs = [];

        await Promise.all(
            fileNames.map(async (fileName) => {
                const filePath = resolve(dirPath, fileName);

                if (fileName !== dirName) {
                    if ((await fsPromises.stat(filePath)).isFile()) {
                        return;
                    }
                    if (!exceptions.some((dn) => dn === filePath)) {
                        dirs.push(...(await getDirsRecursive(filePath)));
                    }
                } else {
                    console.log("start", filePath);

                    const content = await fsPromises.readFile(
                        dataFilePath,
                        "utf8"
                    );
                    const contentAtJson = content ? JSON.parse(content) : [];
                    let data = contentAtJson.find(
                        (elem) => elem.path === filePath
                    ) || {
                        path: filePath,
                    };

                    console.log("data", data);
                    dirs.push(data);
                }
            })
        );

        return dirs;
    };

    return getDirsRecursive(root);
};
