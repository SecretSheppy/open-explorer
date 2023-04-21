class Disk {

    /**
     * initialise new disk manager
     */
    constructor (platform) {
        this.os = platform;
        this.disks = [];
        this.scan();
    }

    /**
     * scan for disks
     */
    scan = () => {
        switch (this.os) {
            // TODO - get more advanced info for each disk (could be a separate function)

            // Microsoft Windows
            case "win32":
                // https://superuser.com/questions/896764/windows-command-line-get-disk-space-in-gb
                this.scanwin()
                    .then((result) => {
                        this.disks = result;
                        console.log(result);
                    });
                break

            // MacOS
            case "darwin":
                // https://stackoverflow.com/questions/14065069/equivalent-of-bat-in-mac-os
                // https://apple.stackexchange.com/questions/325679/diskutil-get-total-and-available-space-on-macos-using-apfs
                this.scanmac();
                break

            // Linux
            case "linux":
                // https://phoenixnap.com/kb/linux-check-disk-space
                this.scanlinux();
                break;
        }
    }

    /**
     * scans for windows disks and gets disk info
     */
    scanwin = () => {
        return new Promise((resolve) => {
            exec('wmic logicaldisk get VolumeName, FreeSpace, Size, Name /format:list', (error, stdout, stderr) => {
                if (error) {
                    console.log(error);
                    return;
                }

                let diskData = ((stdout.replaceAll("\r\r", "")).split("\n")).filter((n) => { return n !== '' });
                let disks = [];

                for (let i = 0; i < diskData.length; i += 4) {
                    disks.push({
                        free: diskData[i].split("=")[1],
                        drive: diskData[i + 1].split("=")[1],
                        size: diskData[i + 2].split("=")[1],
                        name: diskData[i + 3].split("=")[1]
                    });
                }

                resolve(disks);
            });
        });
    }

    /**
     * scans for mac disks
     * @returns {*}
     */
    scanmac = () => {
        return fs.scandirSync("/volumes/");
    }

    /**
     * gets the current disk array
     * @returns currentDiskArray
     */
    get currentDiskArray () {
        return this.disks;
    }

}