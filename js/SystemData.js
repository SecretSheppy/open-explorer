/**
 * system information
 */
class SystemData {
    directory = {
        default: "C:/",
        current: null
    };
    directoryHistory = [];
    actionHistory = [];
    fileTypes = JSON.parse(fs.readFileSync("res/types.json", "utf8"));
    config = JSON.parse(fs.readFileSync("res/config.json", "utf8"));
    pinned = JSON.parse(fs.readFileSync("res/pinned-files.json", "utf8"));
    fsGui = document.getElementById("main-file-system-gui");
    cddGui = document.getElementById("current-directory-display");
    pinnedGui = document.getElementById("pinned");
    searchBar = document.getElementById("search");
    promptGui = {
        wrapper: document.getElementById("prompt"),
        interface: document.getElementById("prompt-interface"),
        newFile: document.getElementById("prompt-new-file"),
        error: document.getElementById("prompt-error")
    };
    promptErrTime = 3000;
    win = nw.Window.get();
    rollingId = 0;
    selectedFile = {
        file: null,
        type: null,
        id: null,
        selected: false
    }
    fileToCopy = {
        file: null,
        type: null,
        set: false
    }
    os = process.platform;
    diskManager = new Disk(this.os);
    tabTitles = {
        home: document.getElementById("home"),
        view: document.getElementById("view"),
        settings: document.getElementById("settings"),
        host: document.getElementById("host"),
        connect: document.getElementById("connect")
    }
    tabContent = {
        home: document.getElementById("home-tab"),
        view: document.getElementById("view-tab"),
        settings: document.getElementById("settings-tab"),
        host: document.getElementById("host-tab"),
        connect: document.getElementById("connect-tab")
    }

    /**
     * retrieves and updates rolling id
     */
    id () {
        this.rollingId += 1;
        return this.rollingId - 1;
    }
}