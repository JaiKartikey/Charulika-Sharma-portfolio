// custom cursor
const cursor = document.getElementById('cursor');
let cx = innerWidth/2, cy = innerHeight/2, tx = cx, ty = cy;
addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
(function loop(){
  cx += (tx-cx)*.22; cy += (ty-cy)*.22;
  cursor.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
  requestAnimationFrame(loop);
})();
document.querySelectorAll('a, button, .tag, .tile, .paper').forEach(el=>{
  el.addEventListener('mouseenter',()=>cursor.classList.add('hover'));
  el.addEventListener('mouseleave',()=>cursor.classList.remove('hover'));
});

// reveal on scroll
const io = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);}});
},{threshold:.15});
document.querySelectorAll('.reveal, .paper, .tile, .timeline li').forEach(el=>{
  el.classList.add('reveal'); io.observe(el);
});

// magnetic tiles tilt
document.querySelectorAll('.tile').forEach(el=>{
  el.addEventListener('mousemove',e=>{
    const r = el.getBoundingClientRect();
    const px = (e.clientX-r.left)/r.width, py = (e.clientY-r.top)/r.height;
    el.style.transform = `perspective(900px) rotateX(${(py-.5)*-6}deg) rotateY(${(px-.5)*8}deg)`;
  });
  el.addEventListener('mouseleave',()=>el.style.transform='perspective(900px) rotateX(0) rotateY(0)');
});

// magnetic pills
document.querySelectorAll('.pill').forEach(el=>{
  el.addEventListener('mousemove',e=>{
    const r=el.getBoundingClientRect();
    const x=e.clientX-(r.left+r.width/2), y=e.clientY-(r.top+r.height/2);
    el.style.transform=`translate(${x*.3}px,${y*.3}px)`;
  });
  el.addEventListener('mouseleave',()=>el.style.transform='translate(0,0)');
});

// particle network
const canvas = document.getElementById('net');
const ctx = canvas.getContext('2d');
let W, H, DPR;
function resize(){
  DPR = Math.min(window.devicePixelRatio||1, 2);
  W = canvas.width = innerWidth*DPR;
  H = canvas.height = innerHeight*DPR;
  canvas.style.width = innerWidth+'px';
  canvas.style.height = innerHeight+'px';
}
resize(); addEventListener('resize', resize);

const N = Math.min(110, Math.floor(innerWidth/14));
const pts = Array.from({length:N},()=>({
  x:Math.random()*W, y:Math.random()*H,
  vx:(Math.random()-.5)*0.25*DPR, vy:(Math.random()-.5)*0.25*DPR
}));
let mx=-9999,my=-9999;
addEventListener('mousemove',e=>{mx=e.clientX*DPR;my=e.clientY*DPR});

function draw(){
  ctx.clearRect(0,0,W,H);
  for(const p of pts){
    p.x+=p.vx; p.y+=p.vy;
    if(p.x<0||p.x>W)p.vx*=-1;
    if(p.y<0||p.y>H)p.vy*=-1;
    // mouse attraction
    const dx=mx-p.x, dy=my-p.y, d=Math.hypot(dx,dy);
    if(d<180*DPR){ p.vx += dx/d*0.04; p.vy += dy/d*0.04; }
    p.vx*=0.985; p.vy*=0.985;
  }
  // lines
  for(let i=0;i<pts.length;i++){
    for(let j=i+1;j<pts.length;j++){
      const a=pts[i],b=pts[j];
      const dx=a.x-b.x, dy=a.y-b.y, d=Math.hypot(dx,dy);
      const max=140*DPR;
      if(d<max){
        const o=(1-d/max)*0.35;
        ctx.strokeStyle=`rgba(201,169,106,${o})`;
        ctx.lineWidth=DPR*.5;
        ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
      }
    }
  }
  // dots
  ctx.fillStyle='rgba(236,231,221,.7)';
  for(const p of pts){ ctx.beginPath(); ctx.arc(p.x,p.y,1.4*DPR,0,Math.PI*2); ctx.fill(); }
  requestAnimationFrame(draw);
}
draw();


const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });