class Pinned {

    constructor(SystemData) {
        this.sys = SystemData;
        this.sys.pinnedGui.innerHTML = "";
        // TODO - need to get disk to wait as exec is async
        // TODO - possibly total rewrite of this and disk class (cut out sys)

        console.log("here");

        for (let i = 0; i < this.sys.diskManager.currentDiskArray.length; i++) {
            let freeSpace = Math.floor(this.sys.diskManager.currentDiskArray[i].free / this.sys.diskManager.currentDiskArray[i].size * 100);

            let disk = document.createElement("div");
            disk.classList.add("disk");
            disk.setAttribute("title", `${freeSpace}% available storage`);

            let wrapper = document.createElement("div");
            wrapper.classList.add("wrapper");

            let floppy = document.createElement("i");
            floppy.classList.add("oe-floppy");
            floppy.classList.add("oe-20hx");
            wrapper.appendChild(floppy);

            let h3 = document.createElement("h3");
            h3.innerHTML = this.sys.diskManager.currentDiskArray[i].drive + " " + this.sys.diskManager.currentDiskArray[i].name;
            wrapper.appendChild(h3);

            disk.appendChild(wrapper);

            let storage = document.createElement("div");
            storage.classList.add("storage");

            let inner = document.createElement("div");
            inner.classList.add("inner");
            inner.style.width = 100 - freeSpace + "%";
            storage.appendChild(inner);

            disk.appendChild(storage);
            this.sys.pinnedGui.appendChild(disk);
        }
    }

}

