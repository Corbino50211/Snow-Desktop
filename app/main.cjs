const {app,BrowserWindow,screen,ipcMain,Tray,Menu,nativeImage,powerMonitor,session}=require('electron');
const fs=require('node:fs');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const {normalize}=require('./settings.cjs');
let settings,control,tray,overlays=[],suspended=false;
const file=name=>path.join(__dirname,name);
const url=name=>pathToFileURL(file(name)).href;
const settingsPath=()=>path.join(app.getPath('userData'),'settings.json');
function broadcast(){for(const win of [...overlays,control]) if(win&&!win.isDestroyed())win.webContents.send('settings',{...settings,enabled:settings.enabled&&!suspended});}
function menu(){tray.setContextMenu(Menu.buildFromTemplate([{label:'Snow Desktop',enabled:false},{label:'Snowfall',type:'checkbox',checked:settings.enabled,click:()=>update({enabled:!settings.enabled})},{label:'Settings',click:showControls},{label:'Clear snow',click:clear},{type:'separator'},{label:'Quit Snow Desktop',click:()=>app.quit()}]));}
function update(value){settings=normalize({...settings,...value});try{fs.writeFileSync(settingsPath(),JSON.stringify(settings,null,2));}catch(error){console.error('Could not save settings:',error.message);}broadcast();menu();}
function clear(){for(const win of overlays)win.webContents.send('clear');}
function lockWindow(win){win.webContents.setWindowOpenHandler(()=>({action:'deny'}));win.webContents.on('will-navigate',event=>event.preventDefault());}
function createOverlays(){for(const win of overlays)win.close();overlays=[];for(const display of screen.getAllDisplays()){
const win=new BrowserWindow({...display.bounds,frame:false,transparent:true,hasShadow:false,resizable:false,movable:false,focusable:false,skipTaskbar:true,show:false,alwaysOnTop:true,webPreferences:{preload:file('preload.cjs'),contextIsolation:true,nodeIntegration:false,sandbox:true}});
win.setIgnoreMouseEvents(true);win.setAlwaysOnTop(true,'floating');if(process.platform==='darwin')win.setVisibleOnAllWorkspaces(true,{visibleOnFullScreen:true});lockWindow(win);win.loadFile(file('snow.html'));win.once('ready-to-show',()=>win.showInactive());overlays.push(win);
}}
function showControls(){if(control&&!control.isDestroyed()){control.show();control.focus();return;}control=new BrowserWindow({width:550,height:740,minWidth:460,minHeight:620,title:'Snow Desktop',backgroundColor:'#101b2b',autoHideMenuBar:true,webPreferences:{preload:file('preload.cjs'),contextIsolation:true,nodeIntegration:false,sandbox:true}});lockWindow(control);control.loadFile(file('settings.html'));control.on('closed',()=>control=null);}
if(!app.requestSingleInstanceLock())app.quit();else{
app.on('second-instance',showControls);app.whenReady().then(()=>{
try{settings=normalize(JSON.parse(fs.readFileSync(settingsPath(),'utf8')));}catch{settings=normalize();}
session.defaultSession.webRequest.onBeforeRequest((details,callback)=>callback({cancel:!details.url.startsWith('file:')}));
ipcMain.handle('get-settings',event=>{if(![url('snow.html'),url('settings.html')].includes(event.senderFrame.url))return null;return {...settings,enabled:settings.enabled&&!suspended};});
ipcMain.on('set-settings',(event,value)=>{if(event.senderFrame.url===url('settings.html')&&value&&typeof value==='object')update(value);});
ipcMain.on('clear',event=>{if(event.senderFrame.url===url('settings.html'))clear();});
ipcMain.on('quit',event=>{if(event.senderFrame.url===url('settings.html'))app.quit();});
const icon=nativeImage.createFromDataURL('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAXUlEQVR4nGN49vU/AzUxVQ2ji4H/oRiXOD45vAaiayRaHJuzsWkmVgxnGKIrJsQnKlL+E4FJjmWSDCMUKaTiIWog1cOQZrFM1XRI1ZxC9byMK2zwhRtJsUwyprqBADTqBVt2KcXGAAAAAElFTkSuQmCC');
tray=new Tray(icon);tray.setToolTip('Snow Desktop');tray.on('click',showControls);menu();createOverlays();showControls();
let timer;const rebuild=()=>{clearTimeout(timer);timer=setTimeout(createOverlays,400);};screen.on('display-added',rebuild);screen.on('display-removed',rebuild);screen.on('display-metrics-changed',rebuild);
for(const event of ['suspend','lock-screen'])powerMonitor.on(event,()=>{suspended=true;broadcast();});for(const event of ['resume','unlock-screen'])powerMonitor.on(event,()=>{suspended=false;broadcast();});
});app.on('window-all-closed',()=>{});app.on('activate',showControls);
}
