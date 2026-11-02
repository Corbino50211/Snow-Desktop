const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('snow',{get:()=>ipcRenderer.invoke('get-settings'),set:value=>ipcRenderer.send('set-settings',value),clear:()=>ipcRenderer.send('clear'),quit:()=>ipcRenderer.send('quit'),onSettings:fn=>ipcRenderer.on('settings',(_event,value)=>fn(value)),onClear:fn=>ipcRenderer.on('clear',()=>fn())});
