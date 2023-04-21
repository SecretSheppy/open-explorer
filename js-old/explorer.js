const fs = require('fs');
const path = require('path');
const nodeCmd = require('node-cmd');

// https://www.npmjs.com/package//fs-extra
const fse = require('fs-extra');

// default path
var defaultDirectory = "C:/";
var currentDirectory = "C:/";
var prevDirectory = "";

// action history (max 32 items)
var actionHistory = [];

// file type data
var fileTypeData = JSON.parse(fs.readFileSync("res/types.json", "utf8"));

// explorer settings
var explorerSettings = JSON.parse(fs.readFileSync("res/config.json", "utf8"));

// file system gui element (html)
var mainFileSystemGui = document.getElementById("main-file-system-gui");

// currently selected file
var selectedFileInfo = {
    file: null,
    id: null,
    selected: false
};

// rolling id counter for elements
var rollingId = 0;

// displaying current directory
var currentDirectoryDisplay = document.getElementById("current-directory-display");

// nw.js-old instance
var win = nw.Window.get();

/**
 * updates the gui ("main" element of body grid) to show the files located inside the specified directory
 * @param directory - directory
 * @param upFile - direction of travel for the action history array. false indicates going down directory tree, true indicates going up.
 */
function updateGuiFileSystem (directory = null, upFile = false) {

    if (!upFile) {
        actionHistory.push({
            action: "down-file",
            path: currentDirectory
        });
    } else {
        actionHistory.pop();
        actionHistory.push({
            action: "up-file",
            path: currentDirectory
        });
    }

    // clearing gui
    mainFileSystemGui.innerHTML = "";
    selectedFileInfo["selected"] = false;

    if (directory) {
        currentDirectory += directory + "/";
    }

    let fileClass = null;
    let currentDirectoryFiles = null;
    let folders = [];
    let files = [];

    // ensuring directory exists before opening it
    try {
        currentDirectoryFiles = fs.readdirSync(currentDirectory);

        currentDirectoryDisplay.value = currentDirectory;
        win.title = "OpenExplorer - " + currentDirectory;

    } catch (e) {
        // if directory doesn't exist set directory to default
        currentDirectoryDisplay.blur();
        currentDirectory = defaultDirectory;
        currentDirectoryDisplay.value = currentDirectory;
        win.title = "OpenExplorer - " + currentDirectory;
        showMiniInterface('direrr');
        currentDirectoryFiles = fs.readdirSync(currentDirectory);
    }

    // separate folders and files into respective arrays
    currentDirectoryFiles.forEach(function (file) {
        if (path.extname(file) === "") {
            fileClass = "oe-folder";
            folders.push({
                file: file,
                class: fileClass
            })
        } else {
            for (let i = 0; i < explorerSettings["processing-order"].length; i++) {
                if (fileTypeData[explorerSettings["processing-order"][i]]["extensions"].includes(path.extname(file))) {
                    fileClass = fileTypeData[explorerSettings["processing-order"][i]]["class"];
                    break;
                }
            }
            if (!fileClass) {
                fileClass = "oe-unknown-file";
            }
            files.push({
                file: file,
                class: fileClass
            });
        }
    });

    // generate folders and files in gui
    folders.forEach(function (folder) {
        generateListing(folder["class"], folder["file"]);
    });
    files.forEach(function (files) {
        generateListing(files["class"], files["file"]);
    });

    mainFileSystemGui.scrollTop = 0;
}

/**
 * launched the target file
 * @param file - directory to file (i.e. c:/users/user/file.txt)
 */
function launchFile (file) {
    nodeCmd.run('"' + file + '"', function (err, data, stderr) {
        fs.writeFileSync("logs/err.log", err);
    });
}

/**
 * generates a gui element for a file
 * @param fileClass - icon class
 * @param file - file type, can be folder or file.
 */
function generateListing (fileClass, file) {
    let fileElement = document.createElement("div");
    fileElement.classList.add("file");
    fileElement.setAttribute("data-relative-directory", currentDirectory + file);
    fileElement.setAttribute("data-directory", file);
    fileElement.id = rollingId;
    if (fileClass === "oe-folder") {
        fileElement.setAttribute("onclick", "select(this.getAttribute('data-directory'), this.id);");
        fileElement.setAttribute("type", "folder");
    } else {
        fileElement.setAttribute("onclick", "select(this.getAttribute('data-relative-directory'), this.id);")
        fileElement.setAttribute("type", "file");
    }

    let icon = document.createElement("i");
    if (fileClass === "oe-folder" && ["Documents", "Desktop", "Downloads"].includes(file)) {
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
        icon.classList.add(fileClass);
    }
    icon.classList.add("oe-20hx");
    fileElement.appendChild(icon);

    let name = document.createElement("h3");
    name.innerText = file;
    fileElement.appendChild(name);

    mainFileSystemGui.appendChild(fileElement);

    rollingId += 1
}

/**
 * navigates up the action history tree by 1
 */
function upLast () {
    let reversedActions = actionHistory.reverse();
    reversedActions.every(function (action) {
        if (action["action"] === "down-file") {
            currentDirectory = action["path"];
            updateGuiFileSystem(null, true);
            return false;
        }
        return true;
    });
}

/**
 * selects a file
 * @param file - file directory (i.e. c:/users/user/file.txt)
 * @param elId - gui element id
 */
function select (file, elId) {
    if (selectedFileInfo["file"] === file) {
        if (file.toLowerCase().includes("c:/")) {
            launchFile(file);
        } else {
            updateGuiFileSystem(file);
        }
    } else {
        if (selectedFileInfo["selected"]) {
            document.getElementById(selectedFileInfo["id"]).style.outline = "none";
        }
        document.getElementById(elId).style.outline = "solid 2px var(--sys-secondary-color)";
        selectedFileInfo["file"] = file;
        selectedFileInfo["id"] = elId;
        selectedFileInfo["selected"] = true;
    }
}

/**
 * creates a file in the current directory
 * @param name - file directory (i.e. c:/users/user/file.txt)
 */
function createFile (name) {
    fs.mkdir(currentDirectory + name + "/");
}

function openWaste () {
    currentDirectory = path.join(path.resolve(), "waste-basket");
    updateGuiFileSystem();
}

function openTransferred () {
    currentDirectory = path.join(path.resolve(), "transferred");
    updateGuiFileSystem();
}

/* runtime */
updateGuiFileSystem();

// if directory selected
var currentDirectoryDisplaySelected = false;

// highlights directory text on input focus
currentDirectoryDisplay.addEventListener("click", function (event) {
    if (!currentDirectoryDisplaySelected) {
        currentDirectoryDisplay.select();
        currentDirectoryDisplaySelected = true;
    }
});

// attempts to open directory on enter press
currentDirectoryDisplay.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        prevDirectory = currentDirectory;
        currentDirectory = currentDirectoryDisplay.value;
        updateGuiFileSystem();
        currentDirectoryDisplay.blur();
        currentDirectoryDisplaySelected = false;
    }
});

// context menu element
var contextMenu = document.getElementById("context-menu");
var contextMenuWidth = 200;
var contextMenuHeight = 300;

// context menu on right click
mainFileSystemGui.addEventListener("contextmenu", function (event) {
    if (selectedFileInfo["selected"]) {
        if (event.y + contextMenuHeight > window.innerHeight) {
            contextMenu.style.top = (window.innerHeight - contextMenuHeight - 10) + "px";
        } else {
            contextMenu.style.top = event.y + "px";
        }
        if (event.x + contextMenuWidth > window.innerWidth) {
            contextMenu.style.left = (window.innerWidth - contextMenuWidth - 10) + "px";
        } else {
            contextMenu.style.left = event.x + "px";
        }
        contextMenu.style.display = "block";
    }
});

// hide context menu
document.addEventListener("click", function (event) {
    contextMenu.style.display = "none";
});