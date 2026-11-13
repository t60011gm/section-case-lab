import * as THREE from 'three';
import {OrbitControls} from './vendor/OrbitControls.js';
import {installPlaneDrag} from './plane-drag.js';
const $=id=>document.getElementById(id), viewer=$('viewer');
const scene=new THREE.Scene();scene.background=new THREE.Color('#e3e5de');
class SoftwareRenderer{
 constructor(){this.domElement=document.createElement('canvas');this.ctx=this.domElement.getContext('2d');this.localClippingEnabled=true;}
 setPixelRatio(v){this.ratio=1;}
 setSize(w,h){this.w=Math.floor(w);this.h=Math.floor(h);this.domElement.width=this.w;this.domElement.height=this.h;this.domElement.style.width=w+'px';this.domElement.style.height=h+'px';this.signature='';}
 render(scene,camera){camera.updateMatrixWorld();const ctx=this.ctx,w=this.w,h=this.h;if(!w||!h)return;const signature=camera.matrixWorld.elements.join(',')+'|'+camera.projectionMatrix.elements.join(',')+'|'+axis+'|'+pos+'|'+reverse+'|'+cut+'|'+$('shell').checked+'|'+$('furniture').checked+'|'+$('terrain').checked+'|'+helper.visible;if(signature===this.signature)return;this.signature=signature;
 const depth=new Float32Array(w*h).fill(Infinity),img=ctx.createImageData(w,h),data=img.data;for(let i=0;i<data.length;i+=4){data[i]=227;data[i+1]=229;data[i+2]=222;data[i+3]=255;}
 const clip=(ps,p)=>{let out=[];for(let i=0;i<ps.length;i++){let a=ps[i],b=ps[(i+1)%ps.length],da=p.distanceToPoint(a),db=p.distanceToPoint(b);if(da>=0)out.push(a);if((da>=0)!=(db>=0))out.push(a.clone().lerp(b,da/(da-db)));}return out;};
 const raster=(a,b,c,rgb)=>{const ar=(b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);if(Math.abs(ar)<1e-8)return;const x0=Math.max(0,Math.floor(Math.min(a.x,b.x,c.x))),x1=Math.min(w-1,Math.ceil(Math.max(a.x,b.x,c.x))),y0=Math.max(0,Math.floor(Math.min(a.y,b.y,c.y))),y1=Math.min(h-1,Math.ceil(Math.max(a.y,b.y,c.y)));for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const px=x+.5,py=y+.5,u=((b.x-px)*(c.y-py)-(b.y-py)*(c.x-px))/ar,v=((c.x-px)*(a.y-py)-(c.y-py)*(a.x-px))/ar,t=1-u-v;if(u<-.00001||v<-.00001||t<-.00001)continue;const z=u*a.z+v*b.z+t*c.z,ix=y*w+x;if(z<depth[ix]){depth[ix]=z;let k=ix*4;data[k]=rgb[0];data[k+1]=rgb[1];data[k+2]=rgb[2];}}};
 scene.traverse(o=>{if(!o.isMesh||!o.visible||o===helper||!o.geometry.attributes.position)return;const at=o.geometry.attributes.position;for(let i=0;i<at.count;i+=3){let ps=[0,1,2].map(j=>new THREE.Vector3().fromBufferAttribute(at,i+j));for(const p of o.material.clippingPlanes||[])ps=clip(ps,p);if(ps.length<3)continue;const normal=ps[1].clone().sub(ps[0]).cross(ps[2].clone().sub(ps[0])).normalize(),shade=(o.material===capMat||o.material===terrainCapMat)?1:.70+.30*Math.abs(normal.dot(new THREE.Vector3(-.4,.8,.3).normalize()));const color=o.material.color.clone().multiplyScalar(shade),hex=color.getHex(),rgb=[(hex>>16)&255,(hex>>8)&255,hex&255];const projected=ps.map(p=>p.clone().project(camera));if(projected.some(p=>p.z>1||p.z< -1))continue;const points=projected.map(p=>({x:(p.x+1)*w/2,y:(1-p.y)*h/2,z:p.z-((o.material===capMat||o.material===terrainCapMat)?1e-5:0)}));for(let k=1;k+1<points.length;k++)raster(points[0],points[k],points[k+1],rgb);}});ctx.putImageData(img,0,0);
 if(helper.visible){helper.updateMatrixWorld();const pp=[[-span*.65,-span*.65,0],[span*.65,-span*.65,0],[span*.65,span*.65,0],[-span*.65,span*.65,0]].map(p=>new THREE.Vector3(...p).applyMatrix4(helper.matrixWorld).project(camera));ctx.beginPath();pp.forEach((p,i)=>{let x=(p.x+1)*w/2,y=(1-p.y)*h/2;i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.closePath();ctx.strokeStyle='rgba(201,95,56,.35)';ctx.lineWidth=1;ctx.setLineDash([6,6]);ctx.stroke();ctx.setLineDash([]);}ctx.fillStyle='#6c786b';ctx.font='11px sans-serif';ctx.fillText('相容繪圖模式 · 無需 GPU',12,h-13);
 }
}
let renderer;try{renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});}catch(e){renderer=new SoftwareRenderer();}renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.localClippingEnabled=true;viewer.appendChild(renderer.domElement);
const persp=new THREE.PerspectiveCamera(38,1,.1,200), ortho=new THREE.OrthographicCamera(-10,10,10,-10,.1,200);let camera=persp;const isoOrtho=new THREE.OrthographicCamera(-10,10,10,-10,.1,200);let dragControl;
const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.target.set(0,5.9,4.4);persp.position.set(-19,15.5,23);
scene.add(new THREE.HemisphereLight(0xffffff,0x7b8373,2.8));const light=new THREE.DirectionalLight(0xfff5df,3);light.position.set(-8,20,12);scene.add(light);
const grid=new THREE.GridHelper(28,28,0xa8b1a3,0xcbd0c5);grid.position.set(0,-.55,4);scene.add(grid);
const plane=new THREE.Plane(new THREE.Vector3(1,0,0),0);const solids=[], caps=new THREE.Group();scene.add(caps);
let axis=0,pos=50,reverse=false,cut=true;
const bounds=[[-3,3],[-1.3,12.1],[-3.7,12.5]];const span=16.2;
function poly(points,x0,x1,color,kind='structure'){
 const vertices=[];for(const x of [x0,x1])for(const [z,y] of points)vertices.push(new THREE.Vector3(x,y,z));
 const n=points.length,faces=[];for(const t of THREE.ShapeUtils.triangulateShape(points.map(p=>new THREE.Vector2(...p)),[])){faces.push([t[2],t[1],t[0]]);faces.push(t.map(i=>n+i));}for(let i=0;i<n;i++){let j=(i+1)%n;faces.push([i,j,n+j],[i,n+j,n+i]);}
 const arr=[];for(const f of faces)for(const i of f)arr.push(...vertices[i].toArray());
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(arr,3));geo.computeVertexNormals();
 const mat=new THREE.MeshStandardMaterial({color,roughness:.85,side:THREE.DoubleSide,clippingPlanes:[plane]});const mesh=new THREE.Mesh(geo,mat);scene.add(mesh);
 const edge=new THREE.LineSegments(new THREE.EdgesGeometry(geo,25),new THREE.LineBasicMaterial({color:0x575a50,transparent:true,opacity:.3,clippingPlanes:[plane]}));scene.add(edge);
 const edges=[];for(let i=0;i<n;i++){let j=(i+1)%n;edges.push([i,j],[n+i,n+j],[i,n+i]);}
 solids.push({vertices,edges,mesh,edge,kind});
}
const wall='#e8e1d2', stair='#bd8863', furn='#758f7c';
function box(x,y,z,w,h,d,c=wall,k='structure'){poly([[z-d/2,y-h/2],[z+d/2,y-h/2],[z+d/2,y+h/2],[z-d/2,y+h/2]],x-w/2,x+w/2,c,k);}
// The source section is traced in relative image units. Depth is an explicitly inferred extrusion.
const P=(px,py)=>[(px-530)/100,(1380-py)/100];
function traced(coords,x0=-2.7,x1=2.7,c=wall,k='structure'){poly(coords.map(p=>P(...p)),x0,x1,c,k)}
traced([[530,1380],[1590,1380],[1590,1430],[530,1430]]);
traced([[1010,1130],[1580,1130],[1580,1150],[1010,1150]]);
traced([[780,1028],[860,1028],[1015,1130],[1000,1150],[845,1050],[780,1050]]);
traced([[530,1028],[780,1028],[780,1045],[530,1045]]);
traced([[1070,877],[1580,877],[1580,898],[1070,898]]);
traced([[375,797],[810,797],[825,817],[375,817]]);
traced([[1390,654],[1580,654],[1580,672],[1390,672]]);
traced([[375,524],[1110,524],[1110,558],[375,558]]);
traced([[890,239],[1140,239],[1140,292],[890,292]]);
traced([[1390,239],[1585,239],[1585,292],[1390,292]]);
// Stair runs expressed as tread blocks between the original section's landings.
function stairs(z0,y0,z1,y1,x0,x1,n){for(let i=0;i<n;i++){let t=i/n,tn=(i+1)/n;let z=z0+(z1-z0)*t,zn=z0+(z1-z0)*tn,y=y0+(y1-y0)*tn;poly([[z,y-.13],[zn,y-.13],[zn,y],[z,y]],x0,x1,stair);}}
let a=P(700,1380),b=P(1000,1130);stairs(...a,...b,-.95,.95,13);
a=P(860,1028);b=P(1080,880);stairs(...a,...b,-.95,.95,9);
a=P(1150,850);b=P(1395,660);stairs(...a,...b,-.95,.95,11);
a=P(800,797);b=P(1210,524);stairs(...a,...b,-.95,.95,16);
// Long party walls: approximate transverse placement; shell can be hidden.
for(let x of [-2.8,2.8]){box(x,2.9,5.25,.2,5.8,10.5,wall,'shell');box(x,7.125,4.475,.2,2.65,12.05,wall,'shell');box(x,9.9,7.05,.2,2.9,6.9,wall,'shell');}
// Facade posts, framing and parapets, not claimed as as-built window specifications.
for(let x of [-2.7,2.7]){box(x,5.65,10.55,.18,11.5,.18);box(x,4.2,0,.18,8.4,.18);}
box(0,10.8,10.5,5.4,.15,.18);box(0,7.2,-1.5,5.4,1,.18);
// Furniture gives activity cues only.
box(.1,1,6.5,1.6,.12,1,furn,'furniture');for(let x of [-.55,.75])for(let z of [6.1,6.9])box(x,.45,z,.08,.9,.08,furn,'furniture');
box(.1,6.6,6.3,1.8,.5,.8,furn,'furniture');box(.1,6.95,6.65,1.8,.4,.12,furn,'furniture');
box(0,9.25,5.4,2.1,.15,1.2,furn,'furniture');for(let x of [-.85,.85])for(let z of [4.95,5.85])box(x,8.82,z,.1,.8,.1,furn,'furniture');
box(0,9.15,10,4.8,.9,.65,furn,'furniture');
// Terrain: horizontal grade lines visible at px162..530 and1595..1783.
// Extrusion width and substrate thickness are inferred, not surveyed geology.
poly([[-3.7,-1.3],[0,-1.3],[0,0],[-3.7,0]],-3,3,'#a99b80','terrain');
poly([[10.65,-1.3],[12.5,-1.3],[12.5,-.04],[10.65,-.04]],-3,3,'#a99b80','terrain');
poly([[0,-1.3],[10.65,-1.3],[10.65,-.58],[0,-.58]],-3,3,'#a99b80','terrain');
// A translucent plane is a locator, not a solid model face.
const helper=new THREE.Mesh(new THREE.PlaneGeometry(16,16),new THREE.MeshBasicMaterial({color:0xe77852,transparent:true,opacity:.08,side:THREE.DoubleSide,depthWrite:false}));scene.add(helper);
const capMat=new THREE.MeshBasicMaterial({color:0x294c4c,side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-1});const terrainCapMat=new THREE.MeshBasicMaterial({color:0xb89565,side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-1});let loops=[];
function cutPolygons(s){const n=s.vertices.length/2;const val=-plane.constant/plane.normal.getComponent(axis);if(axis===0){if(val<=s.vertices[0].x||val>=s.vertices[n].x)return [];return [s.vertices.slice(0,n).map(p=>new THREE.Vector3(val,p.y,p.z))];}
const dim=axis,other=axis===1?2:1,vs=s.vertices.slice(0,n),cross=[];for(let i=0;i<n;i++){let a=vs[i],b=vs[(i+1)%n],da=a.getComponent(dim),db=b.getComponent(dim);if((da<=val&&db>val)||(db<=val&&da>val)){cross.push(a.getComponent(other)+(val-da)/(db-da)*(b.getComponent(other)-a.getComponent(other)));}}cross.sort((a,b)=>a-b);const out=[];for(let i=0;i+1<cross.length;i+=2){if(cross[i+1]-cross[i]<1e-7)continue;let ps=[];for(const [x,t] of [[vs[0].x,cross[i]],[s.vertices[n].x,cross[i]],[s.vertices[n].x,cross[i+1]],[vs[0].x,cross[i+1]]]){let v=new THREE.Vector3();v.x=x;v.setComponent(dim,val);v.setComponent(other,t);ps.push(v);}out.push(ps);}return out;}
function basis(){return axis===0?[new THREE.Vector3(0,0,1),new THREE.Vector3(0,1,0)]:axis===2?[new THREE.Vector3(1,0,0),new THREE.Vector3(0,1,0)]:[new THREE.Vector3(1,0,0),new THREE.Vector3(0,0,1)];}
function update(){let val=bounds[axis][0]+(bounds[axis][1]-bounds[axis][0])*pos/100;const n=new THREE.Vector3();n.setComponent(axis,reverse?-1:1);plane.set(n,-val*(reverse?-1:1));
 for(const s of solids){s.mesh.visible=s.edge.visible=(s.kind!=='terrain'||$('terrain').checked)&&(s.kind!=='shell'||$('shell').checked)&&(s.kind!=='furniture'||$('furniture').checked);s.mesh.material.clippingPlanes=s.edge.material.clippingPlanes=cut?[plane]:[];}
 while(caps.children.length){let c=caps.children[0];c.geometry.dispose();caps.remove(c);}loops=[];
 if(cut)for(const s of solids){if(!s.mesh.visible)continue;for(let ps of cutPolygons(s)){if(ps.length<3)continue;ps.kind=s.kind;loops.push(ps);let arr=[];const [u,v]=basis();const ts=THREE.ShapeUtils.triangulateShape(ps.map(p=>new THREE.Vector2(p.dot(u),p.dot(v))),[]);for(const t of ts)for(const i of t)arr.push(...ps[i].toArray());let g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(arr,3));caps.add(new THREE.Mesh(g,s.kind==='terrain'?terrainCapMat:capMat));}}
 helper.visible=cut&&$('plane').checked;helper.position.set(0,5.8,4.4);helper.position.setComponent(axis,val);helper.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),n);$('slider').value=pos;$('position').textContent=pos+'%';$('mode').textContent=cut?['縱向剖切 · X','水平剖切 · Y','橫向剖切 · Z'][axis]:'完整模型';draw();if(camera===ortho)align();dragControl?.refresh();}
function draw(){let canvas=$('section'),d=devicePixelRatio,w=canvas.clientWidth,h=canvas.clientHeight;canvas.width=w*d;canvas.height=h*d;let ctx=canvas.getContext('2d');ctx.scale(d,d);ctx.fillStyle='#fffdf7';ctx.fillRect(0,0,w,h);if(!cut){ctx.fillStyle='#6f796d';ctx.font='14px sans-serif';ctx.fillText('啟用剖切後顯示目前截面',25,45);return;}let [u,v]=basis(),ub=axis===0?bounds[2]:bounds[0],vb=axis===1?bounds[2]:bounds[1],scale=Math.min((w-50)/(ub[1]-ub[0]),(h-30)/(vb[1]-vb[0]));let ox=(w-(ub[1]-ub[0])*scale)/2,oy=(h-(vb[1]-vb[0])*scale)/2;ctx.fillStyle='#243a32';ctx.strokeStyle='#101f1b';ctx.lineWidth=.7;for(let ps of [...loops].sort((a,b)=>(a.kind==='terrain'?0:1)-(b.kind==='terrain'?0:1))){const soil=ps.kind==='terrain';ctx.fillStyle=soil?'#e0ceb0':'#294c4c';ctx.strokeStyle=soil?'#846440':'#183638';ctx.beginPath();ps.forEach((p,i)=>{let x=ox+(p.dot(u)-ub[0])*scale,y=h-oy-(p.dot(v)-vb[0])*scale;i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.closePath();ctx.fill();ctx.stroke();if(soil){ctx.save();ctx.clip();ctx.beginPath();ctx.strokeStyle='#9d7c50';ctx.lineWidth=.65;for(let hx=-h;hx<w+h;hx+=9){ctx.moveTo(hx,0);ctx.lineTo(hx+h,h);}ctx.stroke();ctx.restore();}}ctx.fillStyle='#8b6453';ctx.font='10px sans-serif';ctx.fillText('相對比例 · 非實測尺寸',10,h-8);}
function align(){let val=bounds[axis][0]+(bounds[axis][1]-bounds[axis][0])*pos/100;let target=new THREE.Vector3(0,5.8,4.5);target.setComponent(axis,val);ortho.position.copy(target).addScaledVector(plane.normal,-35);ortho.up.set(0,axis===1?0:1,axis===1?1:0);controls.target.copy(target);ortho.lookAt(target);controls.update();}
function selectProjection(id){for(const key of ['iso','isoOrtho','ortho']){$(key).classList.toggle('active',key===id);$(key).setAttribute('aria-pressed',String(key===id));}}
function setCamera(flat){selectProjection(flat?'ortho':'iso');$('projection-label').textContent=flat?'剖面正視 · 正投影':'透視投影';camera=flat?ortho:persp;controls.object=camera;controls.enableRotate=!flat;if(flat)align();else{persp.position.set(-19,15.5,23);controls.target.set(0,5.9,4.4);}resize();controls.update();}
function setIsometric(){selectProjection('isoOrtho');camera=isoOrtho;controls.object=camera;controls.enableRotate=true;const target=new THREE.Vector3(0,5.9,4.4);controls.target.copy(target);camera.position.copy(target).add(new THREE.Vector3(-1,1,1).normalize().multiplyScalar(32));camera.up.set(0,1,0);camera.lookAt(target);$('projection-label').textContent='等角投影 · 正投影';resize();controls.update();}
function resize(){const w=viewer.clientWidth,h=viewer.clientHeight;renderer.setSize(w,h);persp.aspect=w/h;persp.updateProjectionMatrix();ortho.left=-9*w/h;ortho.right=9*w/h;ortho.top=9;ortho.bottom=-9;ortho.updateProjectionMatrix();isoOrtho.left=-9*w/h;isoOrtho.right=9*w/h;isoOrtho.top=9;isoOrtho.bottom=-9;isoOrtho.updateProjectionMatrix();draw();}
for(const b of document.querySelectorAll('[data-axis]'))b.onclick=()=>{axis=Number(b.dataset.axis);document.querySelectorAll('[data-axis]').forEach(x=>x.classList.toggle('active',x===b));update();};$('slider').oninput=e=>{pos=Number(e.target.value);update()};$('reverse').onchange=e=>{reverse=e.target.checked;update()};$('enabled').onchange=e=>{cut=e.target.checked;update()};for(const id of ['shell','furniture','plane','terrain'])$(id).onchange=update;$('iso').onclick=()=>setCamera(false);$('ortho').onclick=()=>setCamera(true);$('isoOrtho').onclick=setIsometric;$('reset').onclick=()=>{axis=0;pos=50;reverse=false;cut=true;$('slider').value=50;$('enabled').checked=true;$('reverse').checked=false;document.querySelectorAll('[data-axis]').forEach(b=>b.classList.toggle('active',b.dataset.axis==='0'));setCamera(false);update()};$('download').onclick=()=>{let a=document.createElement('a');a.download='B14-section-'+axis+'-'+pos+'.png';a.href=$('section').toDataURL();a.click()};$('fullscreen').onclick=()=>document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();new ResizeObserver(resize).observe(viewer);
dragControl=installPlaneDrag({THREE,viewer,controls,getCamera:()=>camera,getPlaneMesh:()=>helper,getState:()=>({axis,position:pos,min:bounds[axis][0],max:bounds[axis][1],enabled:cut,center:helper.position.clone()}),setPosition:v=>{pos=v;update();},onMode:on=>{$('dragMode').setAttribute('aria-pressed',String(on));$('orbitMode').setAttribute('aria-pressed',String(!on));$('dragMode').classList.toggle('active',on);$('orbitMode').classList.toggle('active',!on);}});
$('orbitMode').onclick=()=>dragControl.setMode(false);$('dragMode').onclick=()=>{$('plane').checked=true;update();dragControl.setMode(true);};
$('load').remove();update();resize();function animate(){requestAnimationFrame(animate);controls.update();dragControl.refresh();renderer.render(scene,camera)}animate();
