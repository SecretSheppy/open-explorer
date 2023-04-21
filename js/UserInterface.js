class UserInterface {

    /**
     * user interface operations only (i.e. toggling new file prompt)
     * @param SystemData
     */
    constructor (SystemData) {
        this.sys = SystemData;
        this.prompts = {
            newFile: null
        }
    }

    /**
     * hide all prompts
     */
    hideAllPrompts = () => {
        for (const promptItem in this.prompts) {
            this.prompts[promptItem].hide();
            this.prompts[promptItem] = null;
        }
    }

    /**
     * show new-file prompt
     */
    toggleNewFilePrompt = () => {
        if (this.prompts.newFile) {
            this.prompts.newFile.hide();
            this.prompts.newFile = null;
        } else {
            this.prompts.newFile = new Prompt({
                type: "new-file"
            }, this.sys);
        }
    }

    /**
     * rows and icons
     */
    showIcons = () => {
        this.sys.fsGui.classList.remove("full-row");
        this.sys.fsGui.classList.add("icons");
    }

    showRows = () => {
        this.sys.fsGui.classList.remove("icons");
        this.sys.fsGui.classList.add("full-row");
    }

}