const { exec } = require('node:child_process');

exec('wmic logicaldisk get VolumeName, FreeSpace, Size, Name /format:list', (error, stdout, stderr) => {
    if (error) {
        console.log(error);
        return;
    }

    let diskData = ((stdout.replaceAll("\r\r", "")).split("\n")).filter((n) => { return n !== '' });
    let diskDataArray = []

    for (let i = 0; i < diskData.length; i += 4) {
        diskDataArray.push({
            free: diskData[i].split("=")[1],
            drive: diskData[i + 1].split("=")[1],
            size: diskData[i + 2].split("=")[1],
            name: diskData[i + 3].split("=")[1]
        });
    }
});