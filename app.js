'use strict';
// Only the workbook-derived 90-row HACKFLOW_DATA table drives congestion prediction.
const $=id=>document.getElementById(id);
const DESCRIPTIONS={1:'Left perimeter',2:'Upper center aisle',3:'Middle center aisle',4:'Lower center aisle',5:'Upper left cross-aisle',6:'Middle left cross-aisle',7:'Lower left cross-aisle',8:'Upper right cross-aisle',9:'Middle right cross-aisle',10:'Lower right cross-aisle',11:'Right perimeter',12:'Bottom left cross-aisle',13:'Bottom right cross-aisle',14:'Top-left exit corridor',15:'Top-right exit corridor'};
const TARGETS=[['washroom','Washroom / left-side exit'],['snack','Snack counter'],['food','Food pickup near Exit 14 (outside)'],['exit14','Exit near aisle 14'],['exitcenter','Upper middle exit'],['exit3','Upper center-right exit'],['exit15','Exit near aisle 15'],['stage','Stage'],['mlh','MLH booth'],['conoco','ConocoPhillips booth'],['databricks','Databricks booth'],['hitachi','Hitachi booth'],['ds','DS department booth']];
const VENUE_TIMEZONE='America/Chicago';
const FIRST_COVERED='2026-11-07T09:00';
const LAST_COVERED='2026-11-08T09:00'; // Preview cutoff is assumed, not an official breakfast end time.
const LOOKUP=Object.fromEntries(EVENT_PERIODS.map(e=>[e.id,Object.fromEntries(HACKFLOW_DATA.filter(r=>r[0]===e.id).map(r=>[r[1],{estimated:r[3],congestion:r[4],collector:r[2]}]))]));
let routePaths=null,autoStatus='in-range';
function chicagoParts(now=new Date()){
 const fmt=new Intl.DateTimeFormat('en-US',{timeZone:VENUE_TIMEZONE,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
 const p=Object.fromEntries(fmt.formatToParts(now).filter(x=>x.type!=='literal').map(x=>[x.type,x.value]));
 return {stamp:`${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`,date:`${p.year}-${p.month}-${p.day}`,time:`${p.hour}:${p.minute}`};
}
function resolveSchedule(now=new Date()){
 const t=chicagoParts(now).stamp;
 if(t<FIRST_COVERED)return {status:'before',id:'sat_hacking',description:'Before event coverage starts'};
 if(t>=LAST_COVERED)return {status:'after',id:'sun_breakfast',description:'After the breakfast preview window'};
 if(t>='2026-11-08T08:00')return {status:'in-range',id:'sun_breakfast',description:'Breakfast movement'};
 if(t>='2026-11-08T00:00')return {status:'in-range',id:'sun_overnight',description:'Overnight hacking'};
 if(t>='2026-11-07T23:00')return {status:'in-range',id:'sat_departures',description:'Overnight departures'};
 if(t>='2026-11-07T18:40'&&t<'2026-11-07T19:40')return {status:'in-range',id:'sat_dinner',description:'Dinner movement (assumed one-hour window)'};
 if(t>='2026-11-07T12:45'&&t<'2026-11-07T13:45')return {status:'in-range',id:'sat_lunch',description:'Lunch movement (assumed one-hour window)'};
 return {status:'in-range',id:'sat_hacking',description:'Regular hacking activity'};
}
function formatVenueClock(now=new Date()){
 return new Intl.DateTimeFormat('en-US',{timeZone:VENUE_TIMEZONE,weekday:'short',month:'short',day:'numeric',hour:'numeric',minute:'2-digit',timeZoneName:'short'}).format(now);
}
function updateLiveClock(){
 $('liveClock').textContent=formatVenueClock();
 const result=resolveSchedule(), auto=$('timeMode').value==='auto';
 $('event').disabled=auto;
 $('clockStatus').textContent=auto?result.description:'Manual replay · clock still running';
 $('timeModeNote').textContent=auto?(result.status==='in-range'?'Event period is selected automatically. Routes use stored estimates, not live sensors.':'Outside the covered event window: displaying a historical estimate, not current congestion.'):'Choose any of the six workbook periods to replay its estimated congestion.';
 autoStatus=auto?result.status:'manual';
 $('liveClock').closest('.live-clock').classList.toggle('outside-coverage',auto&&result.status!=='in-range');
 if(auto&&$('event').value!==result.id){$('event').value=result.id;refresh();}
 else if(auto)sourceMessage();
}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function currentEvent(){return EVENT_PERIODS.find(e=>e.id===$('event').value)||EVENT_PERIODS[0];}
function getCongestion(){
 const period=LOOKUP[currentEvent().id];
 const result={};
 for(let z=1;z<=15;z++){
   const r=period[z];
   if(!r)throw Error(`Missing sheet reading for section ${z}`);
   result[z]={level:r.estimated,category:r.congestion==='High'?'busy':r.congestion==='Moderate'?'relative':'spacious',label:`${r.congestion} · ${r.estimated} estimated crossings/min`,value:r.estimated,collector:r.collector};
 }
 return result;
}
function populate(){
 for(let z=1;z<=15;z++){
   const o=document.createElement('option');o.value=String(z);o.textContent=`${z} · ${DESCRIPTIONS[z]}`;$('start').append(o);
 }
 for(const [id,label] of TARGETS){const o=document.createElement('option');o.value=id;o.textContent=label;$('destination').append(o);}
 for(const e of EVENT_PERIODS){
   const opt=document.createElement('option');opt.value=e.id;opt.textContent=`${e.time} · ${e.title}`;$('event').append(opt);
   const b=document.createElement('button');b.type='button';b.className='event-button';b.dataset.id=e.id;
   const [day,time]=e.time.split(' · ');
   b.innerHTML=`<span class="when">${escapeHTML(time)}<br><small>${escapeHTML(day.toUpperCase())}</small></span><span><strong>${escapeHTML(e.title)}</strong><small>15 mapped section estimates</small></span>`;
   b.addEventListener('click',()=>{$('timeMode').value='manual';$('event').disabled=false;$('event').value=e.id;updateLiveClock();refresh();});
   $('eventList').append(b);
 }
 $('start').value='9';$('destination').value='washroom';$('event').value='sun_breakfast';
 $('recordCount').textContent=String(HACKFLOW_DATA.length);
}
// Build a weighted pedestrian network from the team's schematic.
// Horizontal corridors only at five walkable rows; vertical corridors at three columns.
// Exterior exits, washroom, sponsor booths and snacks connect to walkable corridors.
const G={nodes:new Map(),edges:[],adj:new Map()};
function addNode(name,x,y){if(G.nodes.has(name))return;G.nodes.set(name,{x,y});G.adj.set(name,[]);}
function connect(a,b,zone){const A=G.nodes.get(a),B=G.nodes.get(b);if(!A||!B)throw Error('Missing route node '+a+' / '+b);const len=Math.hypot(A.x-B.x,A.y-B.y);const e={a,b,zone,len};G.edges.push(e);G.adj.get(a).push({to:b,e});G.adj.get(b).push({to:a,e});}
function mkNode(x,y){return `g${x}_${y}`;}
function row(y,xs,leftZone,rightZone){for(const x of xs)addNode(mkNode(x,y),x,y);for(let k=0;k<xs.length-1;k++)connect(mkNode(xs[k],y),mkNode(xs[k+1],y),(xs[k]+xs[k+1])/2<585?leftZone:rightZone);}
function column(x,ys,findZone){for(const y of ys)addNode(mkNode(x,y),x,y);for(let i=0;i<ys.length-1;i++)connect(mkNode(x,ys[i]),mkNode(x,ys[i+1]),findZone((ys[i]+ys[i+1])/2));}
function sideStop(id,x,y,parent,zone){addNode(id,x,y);connect(id,parent,zone);}
function makeGraph(){
 row(80,[120,230,350,510,585,750,818,980,1050],14,15);
 for(const [y,l,r] of [[185,5,8],[295,6,9],[400,7,10]])row(y,[120,352,585,818,1050],l,r);
 row(508,[120,225,340,352,450,585,770,818,925,1050],12,13);
 column(120,[80,185,295,400,449,508],()=>1);
 column(585,[80,132,185,295,345,400,454,508],y=>y<185?2:y<400?3:4);
 column(1050,[80,185,295,400,508],()=>11);
 for(const x of [230,510,750,980])sideStop('exit-'+x,x,45,mkNode(x,80),x<585?14:15);
 sideStop('snack',585,54,mkNode(585,80),2);
 sideStop('washroom',28,449,mkNode(120,449),1);
 sideStop('stage',585,537,mkNode(585,508),4);
 for(const [id,x,z] of [['mlh',225,12],['conoco',340,12],['databricks',450,12],['hitachi',770,13],['ds',925,13]])sideStop(id,x,535,mkNode(x,508),z);
}
const ZONE_ANCHORS={1:mkNode(120,295),2:mkNode(585,132),3:mkNode(585,345),4:mkNode(585,454),5:mkNode(352,185),6:mkNode(352,295),7:mkNode(352,400),8:mkNode(818,185),9:mkNode(818,295),10:mkNode(818,400),11:mkNode(1050,295),12:mkNode(352,508),13:mkNode(818,508),14:mkNode(350,80),15:mkNode(818,80)};
const DEST_NODES={washroom:'washroom',snack:'snack',food:'exit-230',exit14:'exit-230',exitcenter:'exit-510',exit3:'exit-750',exit15:'exit-980',stage:'stage',mlh:'mlh',conoco:'conoco',databricks:'databricks',hitachi:'hitachi',ds:'ds'};
function dijkstra(start,target,congestion,avoid=false){const dist=new Map(),prev=new Map(),queue=new Set(G.nodes.keys());for(const id of queue)dist.set(id,Infinity);dist.set(start,0);
  while(queue.size){let u=null,score=Infinity;for(const n of queue){const d=dist.get(n);if(d<score){u=n;score=d;}}if(u===null)break;queue.delete(u);if(u===target)break;for(const {to,e} of G.adj.get(u))if(queue.has(to)){const level=congestion[e.zone]?.level||0;const penalty=avoid?(1+Math.min(level,75)/75*5):1;const candidate=score+e.len*penalty;if(candidate<dist.get(to)){dist.set(to,candidate);prev.set(to,{from:u,edge:e});}}}
  if(!Number.isFinite(dist.get(target)))return null;
  const nodes=[target],edges=[];let cur=target;while(cur!==start){const p=prev.get(cur);if(!p)break;edges.unshift(p.edge);nodes.unshift(p.from);cur=p.from;}
  return {nodes,edges,distance:edges.reduce((a,e)=>a+e.len,0),score:dist.get(target),zones:[...new Set(edges.map(e=>e.zone))]};
}
function samePath(a,b){return a&&b&&a.nodes.join('|')===b.nodes.join('|');}
function formatZones(route){return route?.zones?.length?route.zones.join(' → '):'—';}
function routeSummary(route){if(!route)return 'Route unavailable';return `${route.zones.length} aisle sections · schematic length ${Math.round(route.distance)} units`;} // Schematic units, never meters.
function routeCompare(){
 const cg=getCongestion(),start=ZONE_ANCHORS[Number($('start').value)],target=DEST_NODES[$('destination').value];if(!start||!target)return;
 const short=dijkstra(start,target,cg,false),calm=dijkstra(start,target,cg,true);routePaths={short,calm};
 $('shortestTitle').textContent='Direct route';$('shortestDetail').textContent=routeSummary(short);$('shortestPath').textContent='Aisles: '+formatZones(short);
 $('calmerTitle').textContent=samePath(short,calm)?'Same route preferred':'Alternate route';
 $('calmerDetail').textContent=samePath(short,calm)?'The direct route also has the lowest estimated congestion cost.':routeSummary(calm);
 $('calmerPath').textContent='Aisles: '+formatZones(calm);
 drawMap();
}
function colorFor(category){return ({busy:'#cf5858',relative:'#dca047',spacious:'#55a585',unknown:'#a5a5b1'})[category]||'#a5a5b1';}
const SVG_NS='http://www.w3.org/2000/svg';
function el(tag,attrs={},text){const node=document.createElementNS(SVG_NS,tag);for(const [k,v] of Object.entries(attrs))node.setAttribute(k,String(v));if(text!==undefined)node.textContent=String(text);return node;}
function drawMap(){const svg=$('hallMap');svg.replaceChildren();const congestion=getCongestion();
 svg.append(el('rect',{x:65,y:45,width:1070,height:500,rx:3,class:'hall-background'}));
 // Visually separate corridor surface from grouped tables.
 for(const [x,y,w,h,amount] of [[160,100,345,65,'10 tables'],[665,100,325,65,'10 tables'],[160,205,345,70,'12 tables'],[665,205,325,70,'12 tables'],[160,310,345,70,'12 tables'],[665,310,325,70,'12 tables'],[160,415,345,70,'12 tables'],[665,415,325,70,'12 tables']]){
   svg.append(el('rect',{x,y,width:w,height:h,rx:4,class:'hall-table'}),el('text',{x:x+w/2,y:y+31,class:'table-title'},'TEAM TABLES'),el('text',{x:x+w/2,y:y+48,class:'table-sub'},amount));}
 // Map labels and markers.
 for(const [x,id] of [[230,'Exit near 14'],[510,'Exit'],[750,'Exit'],[980,'Exit near 15']]){svg.append(el('path',{d:`M ${x-8} 49 L ${x-8} 27 L ${x-15} 27 L ${x} 13 L ${x+15} 27 L ${x+8} 27 L ${x+8} 49`,class:'exit-line'}),el('text',{x,y:11,class:'exit-text'},id));}
 svg.append(el('rect',{x:540,y:48,width:90,height:26,rx:4,class:'hall-target'}),el('text',{x:585,y:65,class:'hall-tag'},'SNACKS'));
 svg.append(el('rect',{x:1,y:413,width:66,height:63,rx:3,class:'hall-target'}),el('text',{x:34,y:440,class:'hall-tag'},'WASH'),el('text',{x:34,y:454,class:'hall-tag'},'ROOM'));
 svg.append(el('rect',{x:535,y:525,width:100,height:20,rx:3,class:'hall-target'}),el('text',{x:585,y:539,class:'hall-tag'},'STAGE'));
 for(const [name,x] of [['MLH',225],['ConocoPhillips',340],['Databricks',450],['Hitachi',770],['DS Dept.',925]]){svg.append(el('rect',{x:x-51,y:523,width:102,height:22,rx:3,class:'hall-target'}),el('text',{x,y:538,class:'hall-tag'},name));}
 svg.append(el('text',{x:599,y:580,class:'hall-tag'},'SCHEMATIC · NOT TO SCALE'));
 const showRoutes=!!routePaths;
 if(routePaths?.short){const pts=routePaths.short.nodes.map(id=>G.nodes.get(id)).map(n=>`${n.x},${n.y}`).join(' ');svg.append(el('polyline',{points:pts,class:'route-line shortest'}));}
 if(showRoutes&&routePaths?.calm){const pts=routePaths.calm.nodes.map(id=>G.nodes.get(id)).map(n=>`${n.x},${n.y}`).join(' ');svg.append(el('polyline',{points:pts,class:'route-line calmer'}));}
 for(let z=1;z<=15;z++){const pos=G.nodes.get(ZONE_ANCHORS[z]);const g=el('g',{class:'zone-circle-wrap',tabindex:'0',role:'button','aria-label':`Section ${z}, ${DESCRIPTIONS[z]}; ${congestion[z].label}. Select as starting section.`});const c=el('circle',{cx:pos.x,cy:pos.y,r:18,fill:colorFor(congestion[z].category),class:'zone-circle'});g.append(c,el('text',{x:pos.x,y:pos.y+1,class:'zone-label'},z),el('title',{},`Section ${z} — ${DESCRIPTIONS[z]} — ${congestion[z].label}`));g.addEventListener('click',()=>{ $('start').value=String(z);routeCompare();});g.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();$('start').value=String(z);routeCompare();}});svg.append(g);}
 if(routePaths?.short){const p=G.nodes.get(DEST_NODES[$('destination').value]);svg.append(el('circle',{cx:p.x,cy:p.y,r:9,class:'destination-pin'}));}
}

function renderEvents(){
 const e=currentEvent();
 for(const b of $('eventList').children)b.classList.toggle('active',b.dataset.id===e.id);
 const top=Object.entries(LOOKUP[e.id]).map(([z,r])=>({section:z,count:r.estimated})).sort((a,b)=>b.count-a.count).slice(0,3);
 $('evidenceText').textContent=`Highest modeled counts: sections ${top.map(x=>x.section).join(', ')}. These are estimates from the single 90-row workbook, not live sensor readings.`;
}
function sourceMessage(){
 const e=currentEvent();
 let text=`Using ${e.title.toLowerCase()} estimates from HackFlow_90_Simple_Data_Clean_Header.xlsx (15 sections). Values are modeled crossings per minute, not field-measured traffic or walking times.`;
 if($('timeMode').value==='auto'&&autoStatus!=='in-range')text='Historical preview only — current time is outside the covered event schedule. '+text;
 $('sourceExplanation').textContent=text;
 $('modeBadge').textContent='90-ROW MODEL';
 $('mapAnnotation').textContent=`Congestion forecast: ${e.title}. Floor plan and distances are schematic.`;
}
function refresh(){routePaths=null;renderEvents();sourceMessage();routeCompare();}
function init(){
 makeGraph();populate();
 for(const id of ['start','destination','event'])$(id).addEventListener('change',refresh);
 $('timeMode').addEventListener('change',()=>{updateLiveClock();refresh();});
 $('routeButton').addEventListener('click',routeCompare);
 $('resetMap').addEventListener('click',()=>{routePaths=null;drawMap();$('shortestTitle').textContent='—';$('calmerTitle').textContent='—';$('shortestDetail').textContent='Choose a destination to compare routes.';$('calmerDetail').textContent='Based on the selected event period.';$('shortestPath').textContent='';$('calmerPath').textContent='';});
 updateLiveClock();refresh();
 setInterval(updateLiveClock,15000);
 window.addEventListener('focus',updateLiveClock);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)updateLiveClock();});
}
init();
