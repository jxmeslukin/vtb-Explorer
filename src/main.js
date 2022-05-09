const electron = require('electron');
const url = require('url');
const path = require('path');
require('electron-reload')(__dirname);

const {
    app,
    BrowserWindow,
    Menu
} = electron;

let mainWindow;
let addWindow;

// listen for app ready

app.on('ready', function () {
    mainWindow = new BrowserWindow({});
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, "mainWindow.html"),
        protocol: 'file:',
        slashes: true
    }));

    //build menu

    mainMenu = Menu.buildFromTemplate(menuTemplate);
    //Inject Menu
    Menu.setApplicationMenu(mainMenu)
});

//create new windows
function createAddWindow(){
    addWindow = new BrowserWindow({
            width: 300,
            height: 200,
            title: 'Choose blockchain:'
    });
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, "addWindow.html"),
        protocol: 'file:',
        slashes: true
    }));
}

//menu template

const menuTemplate = [{
        label: 'File',
        submenu: [{
                label: 'Choose blockchain',
                click(){
                    createAddWindow();
                }
            },
            {
                label: 'Clear'
            },
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q':
                'Ctrl+Q',
                click(){
                    app.quit();
                }
            }

        ]
    }

]