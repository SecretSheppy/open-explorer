class Controls {

    /**
     * controls for interface
     * @param SystemData
     */
    constructor (SystemData) {
        this.sys = SystemData;
        this.tools = new DirectoryTools(this.sys);
        this.ui = new UserInterface(this.sys);
    }

    /**
     * selects a file
     * @param file
     * @param elId
     * @param type
     */
    select = (file, elId, type = null) => {
        if (this.sys.selectedFile.file === file) {
            if (type === "file") {
                // open a file with default application
                nodeCmd.run('"' + file + '"', function (err, data, stderr) {
                    fs.writeFileSync("logs/err.log", err);
                });
            } else {
                // TODO - need to not push this if directory doesn't exist
                // open a new directory
                this.sys.directoryHistory.push(new Explorer(this.sys.directory.current + file + "/", this.sys));
            }
        } else {
            if (this.sys.selectedFile.selected) {
                document.getElementById(this.sys.selectedFile.id).style.outline = "none";
            }
            this.sys.selectedFile = {
                file: file,
                type: document.getElementById(elId).getAttribute("type"),
                id: elId,
                selected: true
            }
            document.getElementById(this.sys.selectedFile.id).style.outline = "solid 2px var(--sys-secondary-color)";
        }
    }

    /**
     * navigates to the previously loaded directory
     */
    back = () => {
        if (this.sys.directoryHistory.length !== 0) {
            this.sys.directoryHistory[this.sys.directoryHistory.length - 1].undo();
            this.sys.directoryHistory.pop();
        }
    }

    /**
     * create a file in the current directory
     */
    createFile = () => {
        let fileNameElement = document.getElementById("new-folder-name");
        if (fileNameElement.value !== "") {
            this.sys.actionHistory.push(new this.tools.Create(this.sys.directory.current + fileNameElement.value + "/"));
            new Explorer(this.sys.directory.current, this.sys);
            fileNameElement.value = "";
        }
    }

    /**
     * deletes currently selected file provided the user is not in the default directory (i.e. root directory)
     */
    wasteFile = () => {
        if (this.sys.selectedFile.selected && this.sys.directory.current !== this.sys.directory.default && this.sys.selectedFile.type !== "file") {
            this.sys.actionHistory.push(new this.tools.Waste(this.sys.directory.current, this.sys.selectedFile.file));
            new Explorer(this.sys.directory.current, this.sys);
        }
        if (this.sys.selectedFile.selected && this.sys.directory.current !== this.sys.directory.default) {
            // TODO - delete file
        }
    }

    /**
     * quick opening pinned locations
     */
    openPinnedLocation = (location) => {
        this.sys.directoryHistory.push(new Explorer(location, this.sys));
    }

    /**
     * opens selected tab and closes old tab
     */
    openTab = (tabId) => {
        for (const tab in this.sys.tabTitles) {
            if (this.sys.tabTitles[tab].id === tabId) {
                this.sys.tabTitles[tab].classList.add("active");
            } else {
                this.sys.tabTitles[tab].classList.remove("active");
            }
        }
        for (const tab in this.sys.tabContent) {
            if (this.sys.tabContent[tab].id === tabId + "-tab") {
                this.sys.tabContent[tab].classList.add("active");
            } else {
                this.sys.tabContent[tab].classList.remove("active");
            }
        }
    }

    /**
     * stores selected file to clipboard
     */
    setClipboard = () => {
        if (this.sys.selectedFile.type !== "file") {
            this.sys.fileToCopy = {
                file: this.sys.directory.current + this.sys.selectedFile.file + "/",
                type: this.sys.selectedFile.type,
                set: true
            }
        } else {
            this.sys.fileToCopy = {
                file: this.sys.selectedFile.file,
                type: this.sys.selectedFile.type,
                set: true
            }
        }
        console.log(this.sys.fileToCopy.type);
    }

    /**
     * paste file from clipboard
     */
    pasteClipboard = () => {
        if (!this.sys.fileToCopy.set) {
            return;
        }
        let dirArray = this.sys.fileToCopy.file.split("/");
        if (this.sys.fileToCopy.type !== "file") {
            this.sys.actionHistory.push(new this.tools.CopyFolder(this.sys.fileToCopy.file, this.sys.directory.current + dirArray[dirArray.length - 2] + "/"));
            new Explorer(this.sys.directory.current, this.sys);
        } else {
            console.log("in here");
            this.sys.actionHistory.push(new this.tools.CopyFile(this.sys.fileToCopy.file, this.sys.directory.current + dirArray[dirArray.length - 1]));
            new Explorer(this.sys.directory.current, this.sys);
        }
    }
}