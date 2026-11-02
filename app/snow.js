const canvas=document.querySelector('canvas'),ctx=canvas.getContext('2d');
let settings,flakes=[],drift=[],width=0,height=0,last=0,elapsed=0;
function resize(){width=innerWidth;height=innerHeight;const dpr=Math.min(devicePixelRatio,2);canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);drift=new Array(Math.ceil(width/4)+1).fill(0);flakes=[];}
function clear(){flakes=[];drift.fill(0);ctx.clearRect(0,0,width,height);}
function spawn(randomY=false){return {x:Math.random()*width,y:randomY?Math.random()*height:-12,r:(0.4+Math.random()*0.6)*settings.size,v:18+Math.random()*35,phase:Math.random()*Math.PI*2};}
function draw(now){requestAnimationFrame(draw);if(!settings)return;if(now-last<1000/settings.fps)return;const dt=Math.min((now-last)/1000,0.08);last=now;if(!settings.enabled){ctx.clearRect(0,0,width,height);return;}elapsed+=dt;
while(flakes.length<settings.intensity)flakes.push(spawn(true));if(flakes.length>settings.intensity)flakes.length=Math.floor(settings.intensity);
ctx.clearRect(0,0,width,height);ctx.fillStyle=settings.color;ctx.globalAlpha=settings.opacity;
for(let i=0;i<flakes.length;i++){const f=flakes[i];f.y+=f.v*settings.speed*dt;f.x+=(settings.wind+Math.sin(elapsed+f.phase)*8)*dt;f.x=(f.x+width)%width;const column=Math.min(drift.length-1,Math.floor(f.x/4));if(f.y+f.r>=height-(settings.accumulate?drift[column]:0)){if(settings.accumulate){drift[column]=Math.min(65,drift[column]+f.r*0.22);for(let j=0;j<2;j++){const a=Math.max(0,column-j),b=Math.min(drift.length-1,column+j);drift[a]=Math.max(drift[a],drift[column]-j*2);drift[b]=Math.max(drift[b],drift[column]-j*2);}}flakes[i]=spawn();continue;}ctx.beginPath();ctx.arc(f.x,f.y,f.r,0,Math.PI*2);ctx.fill();}
if(settings.accumulate){ctx.beginPath();ctx.moveTo(0,height);for(let i=0;i<drift.length;i++){drift[i]=Math.max(0,drift[i]-dt*0.12);ctx.lineTo(i*4,height-drift[i]);}ctx.lineTo(width,height);ctx.closePath();ctx.fill();}}
window.snow.onSettings(value=>{settings=value;if(!value.accumulate)drift.fill(0);});window.snow.onClear(clear);window.snow.get().then(value=>settings=value);addEventListener('resize',resize);resize();requestAnimationFrame(draw);
