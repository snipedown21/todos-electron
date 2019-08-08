const electron = require('electron');

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    }
  });
  mainWindow.loadURL(`file://${__dirname}/main.html`);
  mainWindow.on('closed', () => app.quit());

  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

function createAddWindow() {
  addWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: 'Add New ToDo',
      webPreferences: {
        nodeIntegration: true
      }
  });
  addWindow.loadURL(`file://${__dirname}/add.html`);
  addWindow.on('closed', () => addWindow = null);
}

ipcMain.on('todo:add', (event, todo) => {
  mainWindow.webContents.send('todo:add', todo);
  addWindow.close();
});

const menuTemplate = [
  {
    label: 'File',
    submenu: [
      { label: 'New ToDo',
        accelerator: process.platform === 'darwin' ? 'Command+N' : 'Ctrl+N',
        click() { createAddWindow(); }
      },
      {
        label: 'Clear ToDos',
        accelerator: process.platform === 'darwin' ? 'Command+D' : 'Ctrl+D',
        click() {
          mainWindow.webContents.send('todo:clear');
        }
      },
      { label: 'Quit',
        accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click() {
        app.quit();
        }
      }
    ]
  }
];

if(process.platform === 'darwin') {
menuTemplate.unshift({
  label: ''
});
}


/* Code required to debug with dev tools, reload with Command+R*/

// if(process.env.NODE_ENV !== 'production') {
//   menuTemplate.push({
//     label: 'View',
//     submenu: [
//       { role: 'reload' },
//       {
//         label: 'Toggle Developer Tools',
//         accelerator: process.platform === 'darwin' ? 'Command+Alt+I' : 'Ctrl+Alt+I',
//         click(item, focusedWindow) {
//           focusedWindow.toggleDevTools();
//         }
//       }
//     ]
//   });
// }

/* Add this code to each BrowserWindow instance to be able to make
  require statement imports within the html files */

  // webPreferences: {
  //   nodeIntegration: true
  // }
