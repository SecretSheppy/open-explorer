class DirectoryTools {

    // TODO - finish Waste class
    Waste = class {

        /**
         * copies file to wasteBasket and then deletes file from original directory
         * @param filePath - path to file
         * @param fileName - name of file
         */
        constructor (filePath, fileName) {
            this.directories = {
                original: filePath + fileName,
                wasteBasket: path.resolve() + "\\waste-basket\\" + fileName
            }

            // Copy and Delete Files
            try {
                fse.moveSync(this.directories.original, this.directories.wasteBasket, { overwrite: true|false });
            } catch (e) {
                console.log(e);
            }
        }

        /**
         * copies file from wasteBasket to original directory and then deletes from wasteBasket
         */
        undo = () => {
            try {
                console.log(this.directories.wasteBasket, this.directories.original);
                fse.moveSync(this.directories.wasteBasket, this.directories.original, { overwrite: true|false });
            } catch (e) {
                console.log(e);
            }
        }

    }

    CopyFolder = class {

        /**
         * copies files
         * @param originalPath
         * @param destinationPath
         */
        constructor (originalPath, destinationPath) {
            this.directories = {
                original: originalPath,
                new: destinationPath
            }

            fse.copySync(this.directories.original, this.directories.new, { overwrite: true|false })
        }

        /**
         * undoes copying of files
         */
        undo () {
            fs.rmSync(this.directories.new, { force:true, recursive:true });
        }

    }

    CopyFile = class {

        /**
         * copies a single file
         * @param originalPath
         * @param destinationPath
         */
        constructor (originalPath, destinationPath) {
            this.directories = {
                original: originalPath,
                new: destinationPath
            }
            fs.copyFileSync(this.directories.original, this.directories.new);
        }

        /**
         * undoes copying of single file
         */
        undo () {
            fs.unlinkSync(this.directories.new);
        }
    }

    Create = class {

        /**
         * create a new file
         * @param path
         */
        constructor (path) {
            this.createdPath = path;
            fs.mkdirSync(this.createdPath, { recursive: true });
        }

        /**
         * undoes create action
         */
        undo () {
            fs.rmSync(this.createdPath, { force: true, recursive: true });
        }

    }

    /**
     * objects for directory management
     * @param SystemData
     */
    constructor (SystemData) {
        this.sys = SystemData;
    }

}