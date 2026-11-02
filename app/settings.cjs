const defaults = Object.freeze({enabled:true, intensity:100, speed:1, size:3, wind:12, opacity:0.8, accumulate:true, color:'#ffffff', fps:30});
function normalize(value={}) {
  const out={...defaults};
  for(const key of ['enabled','accumulate']) if(typeof value[key]==='boolean') out[key]=value[key];
  for(const [key,min,max] of [['intensity',10,400],['speed',0.2,3],['size',1,8],['wind',-100,100],['opacity',0.1,1],['fps',15,60]])
    if(Number.isFinite(value[key])) out[key]=Math.max(min,Math.min(max,value[key]));
  if(/^#[0-9a-f]{6}$/i.test(value.color)) out.color=value.color;
  return out;
}
module.exports={defaults,normalize};
