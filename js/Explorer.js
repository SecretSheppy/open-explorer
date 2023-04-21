class Explorer {

    /**
     * Explore a folder
     * @param directory - directory to explore
     * @param SystemData
     */
    constructor(directory, SystemData) {
        this.dir = directory;
        this.sys = SystemData;
        this.sys.selectedFile = {
            file: null,
            type: null,
            id: null,
            selected: false
        };
        this.oldDir = this.sys.directory.current;
        if (this.sys.directory.current !== this.dir) {
            this.sys.actionHistory = [];
        }
        this.sys.directory.current = this.dir;
        this.open();
    }

    /**
     * opens directory
     */
    open () {
        try {
            let directoryData = fs.readdirSync(this.sys.directory.current);
            new Gui(this.sys, directoryData);
            this.sys.selectedFile.selected = false;
        } catch (e) {
            // TODO - when this prompt appears and user opens another prompt it appears in this prompt
            // directory doesn't exist
            new Prompt({
                type: "error",
                innerHTML: `The file <strong>${this.sys.directory.current}</strong> is inaccessible or does not exist!`
            }, this.sys);
            this.undo();
        }
    }

    /**
     * undoes opening directory;
     */
    undo () {
        if (this.oldDir !== null) {
            this.sys.directory.current = this.oldDir;
            this.open();
        }
    }
}