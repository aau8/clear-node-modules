import fsPromises from "fs/promises";
import { resolve } from "path";
import { getDirs } from "./getDirs.js";

const main = async () => {
    console.log("Старт!");

    // await fsPromises.link("./test", "./whoooaaa-test")

    const dirPaths = await getDirs({
        root: resolve("C:\\Users\\Mi\\Desktop\\telegram"),
        // root: resolve("C:\\Users\\Mi\\Desktop\\javascript\\pnpm"),
        // root: resolve("C:\\Users\\Mi"),
        // root: resolve("./test"),
        // root: resolve("C:\\Users\\Mi\\Desktop"),
        dirName: "node_modules",
        exceptions: [
            // resolve("C:\\Users\\Mi\\Desktop"),
            // resolve("./test/test2"),
            // "C:\\Users\\Mi\\Desktop\\javascript",
            // "C:\\Users\\Mi\\Desktop\\clear-node-modules",
            // "C:\\Users\\Mi\\Desktop\\RGBrands\\admin\\node_modules",
            // "C:\\Users\\Mi\\Desktop\\RGBrands\\leaderboard-vite\\node_modules"
        ],
    });

    console.log(dirPaths)
    // console.log(Math.trunc(dirPaths.reduce((acc, cur) => acc + cur.size, 0) / 1000) / 1000 + 'mb')

    // await fsPromises.writeFile("./node-modules-pathes.json", JSON.stringify(dirPaths, undefined, 2))

    // Удаление
    await Promise.all(dirPaths.map(async dirPath => {
        return fsPromises.rm(dirPath.path, { recursive: true, force: true })
    }))

    console.log("Готово!");
};

main();
