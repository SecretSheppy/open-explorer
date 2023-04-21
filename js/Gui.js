class Gui {

    /**
     * Gui Controls
     * @param SystemData
     * @param directoryData
     */
    constructor (SystemData, directoryData) {
        this.sys = SystemData;
        this.dirData = directoryData;
        this.folders = [];
        this.files = [];

        // generation process
        this.getData();
        this.sys.fsGui.innerHTML = "";
        this.sys.fsGui.scrollTop = 0;
        this.generate();
        this.sys.win.title = "OpenExplorer - " + this.sys.directory.current;
        this.sys.cddGui.value = this.sys.directory.current;
    }

    /**
     * gets file and folder data from directoryData
     */
    getData = () => {
        this.dirData.forEach((file) => {
            if (path.extname(file) === "") {
                this.folders.push({
                    file: file,
                    class: "oe-folder"
                });
            } else {
                let fClass = null;
                for (let i = 0; i < this.sys.config["processing-order"].length; i++) {
                    if (this.sys.fileTypes[this.sys.config["processing-order"][i]]["extensions"].includes(path.extname(file))) {
                        fClass = this.sys.fileTypes[this.sys.config["processing-order"][i]]["class"];
                        break;
                    }
                }
                if (!fClass) {
                    fClass = "oe-unknown-file";
                }
                this.files.push({
                    file: file,
                    class: fClass
                });
            }
        });
    }

    /**
     * loops through files and folders to generate listings
     */
    generate = () => {
        this.folders.forEach((folder) => {
            this.generateListing(folder.file, folder.class);
        });
        this.files.forEach((file) => {
            this.generateListing(file.file, file.class);
        });
    }

    /**
     * generate a file/folder listing
     * @param file
     * @param fClass
     */
    generateListing = (file, fClass) => {
        let fElement = document.createElement("div");
        fElement.classList.add("file");
        fElement.setAttribute("data-relative-directory", this.sys.directory.current + file);
        fElement.setAttribute("data-directory", file);
        fElement.id = this.sys.id();
        if (fClass === "oe-folder") {
            fElement.setAttribute("onclick", "controls.select(this.getAttribute('data-directory'), this.id);");
            fElement.setAttribute("type", "folder");
        } else {
            fElement.setAttribute("onclick", "controls.select(this.getAttribute('data-relative-directory'), this.id, this.getAttribute('type'));")
            fElement.setAttribute("type", "file");
        }

        let icon = document.createElement("i");
        if (fClass === "oe-folder" && ["Documents", "Desktop", "Downloads"].includes(file)) {
            switch (file) {
                case "Documents":
                    icon.classList.add("oe-documents");
                    break
                case "Desktop":
                    icon.classList.add("oe-desktop");
                    break
                case "Downloads":
                    icon.classList.add("oe-downloads");
                    break
            }
        } else {
            icon.classList.add(fClass);
        }
        icon.classList.add("oe-20hx");
        fElement.appendChild(icon);

        let name = document.createElement("h3");
        name.innerText = file;
        fElement.appendChild(name);

        this.sys.fsGui.appendChild(fElement);
    }

}