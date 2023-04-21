nw.Window.open("html/window.html", {}, function (win) {
    win.hide();
    win.width = 1200;
    win.height = 700;
    win.setPosition("center");
    win.title = "OpenExplorer - c:/";

    win.setMinimumSize(850, 400);

    win.on("loaded", function () {
        win.show();
        win.focus();
    });
});