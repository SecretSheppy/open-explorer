/*
go to folder of first letter on key press

document.addEventListener("keydown", function (event) {
    if (currentDirectoryDisplay !== document.activeElement) {
        let children = mainFileSystemGui.children;
        for (let i = 0; i < children.length; i++) {
            if ((children[i].children)[1].innerText.toLowerCase()[0] === event.key && selectedFileInfo["id"] !== children[i].id) {
                if (children[i].getAttribute("type") === "folder") {
                    mainFileSystemGui.scrollTop = children[i].offsetTop - 160;
                    select(children[i].getAttribute("data-directory"), children[i].id);
                } else {
                    select(children[i].getAttribute("data-relative-directory"), children[i].id);
                }
                break;
            }
        }
    }
});
 */

/**
 * global keydown listener for shortcuts
 */
document.addEventListener("keydown", (event) => {

    /**
     * listener for ctrl + c
     * stores currently selected item to clipboard
     */
    if (event.ctrlKey && event.key === "c") {
        controls.setClipboard();
    }

    /**
     * listener for ctrl + c
     * pastes file from clipboard
     */
    if (event.ctrlKey && event.key === "v") {
        controls.pasteClipboard();
    }

    /**
     * listener for ctrl + z
     * undoes the most last element in sys.actionHistory
     */
    if (event.ctrlKey && event.key === "z" && sys.actionHistory.length !== 0) {
        sys.actionHistory[sys.actionHistory.length - 1].undo();
        sys.actionHistory.pop();
        new Explorer(sys.directory.current, sys);
    }

    /**
     * listener for ctrl + n
     * toggles new file prompt
     */
    if (event.ctrlKey && event.key === "n") {
        controls.ui.toggleNewFilePrompt();
    }

    /**
     * listener for ctrl + shift + n
     * opens new window
     */
    if (event.ctrlKey && event.keyCode === 78 && event.shiftKey) {
        nw.Window.open("html/window.html", {}, function (win) {
            win.hide();
            win.width = 1200;
            win.height = 700;
            win.setPosition("center");
            win.title = "OpenExplorer - c:/";

            win.setMinimumSize(700, 600);

            win.on("loaded", function () {
                win.show();
                win.focus();
            });
        });
    }

    /**
     * listener for Escape
     * closes prompt window
     */
    if (event.key === "Escape") {
        controls.ui.hideAllPrompts();
    }

    /**
     * listener for Delete
     * deletes selected file
     */
    if (event.key === "Delete") {
        controls.wasteFile();
    }

    /**
     * listener for ctrl + t
     * opens current directory in terminal
     */
    if (event.ctrlKey && event.key === "t") {
        // TODO - currently windows only feature
        if (sys.os === "win32") {
            nodeCmd.run('start cmd /k cd "' + sys.directory.current + '"', function (err, data, stderr) {
                fs.writeFileSync("logs/err.log", err);
            });
        }
    }

    /**
     * listener for Enter
     * submits data
     */
    if (event.key === "Enter") {
        switch (document.activeElement.id) {
            case "new-folder-name":
                controls.createFile();
                controls.ui.toggleNewFilePrompt();
                break;
        }
    }
});

/**
 * listener for keyup
 * ensures that jump to focus in input fields doesn't collect the pressed key as an input
 */
document.addEventListener("keyup", (event) => {

    /**
     * listener for \
     * jumps to search bar if cdd is not focused
     */
    if (event.key === "\\" && sys.cddGui !== document.activeElement) {
        sys.searchBar.focus();
    }

    /**
     * listener for ctrl + d
     * jumps to cdd
     */
    if (event.ctrlKey && event.key === "d") {
        sys.cddGui.focus();
    }
})

/**
 * listener for manual directory input (via sys.cddGui)
 */
sys.cddGui.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        if (sys.cddGui.value[sys.cddGui.value.length - 1] !== "/") {
            sys.cddGui.value += "/";
        }
        sys.directoryHistory.push(new Explorer(sys.cddGui.value, sys));
        sys.cddGui.blur();
    }
});