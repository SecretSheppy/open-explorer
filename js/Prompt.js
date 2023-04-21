class Prompt {

    /**
     * shows a prompt
     * @param promptData
     * @param SystemData
     */
    constructor (promptData, SystemData) {
        this.prompt = promptData;
        this.sys = SystemData;
        switch (this.prompt.type) {
            case "error":
                this.error();
                break
            case "new-file":
                this.newFilePrompt();
                break
        }
    }

    showWindow = () => {
        this.sys.promptGui.wrapper.style.display = "flex";
        this.sys.promptGui.interface.style.display = "block";
    }

    /**
     * error prompt - appears red with white text
     */
    error = () => {
        this.showWindow();
        this.sys.promptGui.interface.classList.add("error");
        this.sys.promptGui.error.style.display = "flex";
        this.sys.promptGui.error.innerHTML = this.prompt.innerHTML;
        setTimeout(() => {
            this.sys.promptGui.interface.classList.remove("error");
            this.hide();
        }, this.sys.promptErrTime);
    }

    /**
     * new file prompt - appears with text box and 2 buttons
     */
    newFilePrompt = () => {
        this.showWindow();
        this.sys.promptGui.newFile.style.display = "flex";
        this.sys.promptGui.newFile.children[0].focus();
    }

    /**
     * hides prompt
     */
    hide = () => {
        for (const element in this.sys.promptGui) {
            this.sys.promptGui[element].style.display = "none";
        }
    }

}