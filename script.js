/* ══════ PARTICLES ══════ */
(function(){
  const c=document.getElementById('particles-canvas');
  const ctx=c.getContext('2d');
  let W,H,pts=[];
  function resize(){W=c.width=window.innerWidth;H=c.height=window.innerHeight;}
  resize();window.addEventListener('resize',resize);
  class Pt{
    constructor(){this.reset();}
    reset(){
      this.x=Math.random()*W;this.y=Math.random()*H;
      this.vx=(Math.random()-.5)*.3;this.vy=(Math.random()-.5)*.3;
      this.r=Math.random()*1.5+.3;
      this.a=Math.random()*.4+.1;this.life=Math.random()*200+100;this.age=0;
    }
    draw(){
      if(++this.age>this.life)this.reset();
      const fade=this.age<20?this.age/20:this.age>this.life-20?(this.life-this.age)/20:1;
      ctx.beginPath();ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(255,98,0,${this.a*fade})`;ctx.fill();
      this.x+=this.vx;this.y+=this.vy;
    }
  }
  for(let i=0;i<80;i++)pts.push(new Pt());
  // connections
  function drawLines(){
    for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){
      const dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.sqrt(dx*dx+dy*dy);
      if(d<120){ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);
        ctx.strokeStyle=`rgba(255,98,0,${.08*(1-d/120)})`;ctx.lineWidth=.5;ctx.stroke();}
    }
  }
  function animate(){ctx.clearRect(0,0,W,H);drawLines();pts.forEach(p=>p.draw());requestAnimationFrame(animate);}
  animate();
})();

/* ══════ CURSOR ══════ */
const cur=document.getElementById('cur'),ring=document.getElementById('cur-ring'),curTxt=document.getElementById('cur-text');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.left=mx+'px';cur.style.top=my+'px';},{passive:true});
(function animRing(){rx+=(mx-rx)*.1;ry+=(my-ry)*.1;ring.style.left=rx+'px';ring.style.top=ry+'px';curTxt.style.left=rx+'px';curTxt.style.top=(ry+30)+'px';requestAnimationFrame(animRing);})();
document.querySelectorAll('a,button,.port-card,.svc').forEach(el=>{
  el.addEventListener('mouseenter',()=>document.body.classList.add('cur-hover'));
  el.addEventListener('mouseleave',()=>document.body.classList.remove('cur-hover'));
});

/* ══════ NAV ══════ */
const nav=document.getElementById('nav'),btt=document.getElementById('btt');
const ham=document.getElementById('ham'),mob=document.getElementById('mobMenu');
ham.addEventListener('click',()=>{ham.classList.toggle('open');mob.classList.toggle('open');});
mob.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{ham.classList.remove('open');mob.classList.remove('open');}));
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
  const t=document.querySelector(a.getAttribute('href'));
  if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth'});}
}));

/* ══════ SCROLL HANDLER ══════ */
const prog=document.getElementById('prog');
window.addEventListener('scroll',()=>{
  const s=window.scrollY,h=document.documentElement.scrollHeight-window.innerHeight;
  prog.style.width=(s/h*100)+'%';
  nav.classList.toggle('stuck',s>60);
  btt.classList.toggle('show',s>500);
  // active nav
  document.querySelectorAll('section[id]').forEach(sec=>{
    if(s>=sec.offsetTop-100&&s<sec.offsetTop+sec.offsetHeight-100){
      document.querySelectorAll('.nav-links a').forEach(a=>a.classList.remove('active'));
      const lk=document.querySelector(`.nav-links a[href="#${sec.id}"]`);
      if(lk)lk.classList.add('active');
    }
  });
},{passive:true});
btt.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

/* ══════ SCROLL ANIMATIONS ══════ */
const animEls=document.querySelectorAll('[data-anim]');
const aObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('anim-in');
      // trigger skill circles if inside this element
      e.target.querySelectorAll('.sk-fill').forEach(triggerCircle);
      aObs.unobserve(e.target);
    }
  });
},{threshold:0.1,rootMargin:'0px 0px -60px 0px'});
animEls.forEach(el=>aObs.observe(el));

/* ══════ SKILL CIRCLES ══════ */
function triggerCircle(c){
  const pct=parseFloat(c.dataset.pct);
  const circ=2*Math.PI*38; // r=38
  const offset=circ*(1-pct/100);
  c.style.setProperty('--dash',offset);
  setTimeout(()=>c.classList.add('go'),150);
}
// Also observe circles directly
document.querySelectorAll('.sk-circ').forEach(sc=>{
  const cObs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.querySelectorAll('.sk-fill').forEach(triggerCircle);cObs.unobserve(e.target);}});
  },{threshold:.5});
  cObs.observe(sc);
});

/* ══════ COUNTER ANIMATION ══════ */
function animCount(el,target,duration=1800){
  let start=null;
  function step(ts){
    if(!start)start=ts;
    const prog=Math.min((ts-start)/duration,1);
    const ease=1-Math.pow(1-prog,4);
    el.textContent=Math.floor(ease*target);
    if(prog<1)requestAnimationFrame(step);else el.textContent=target;
  }
  requestAnimationFrame(step);
}
const countEls=document.querySelectorAll('[data-target]');
const cntObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){animCount(e.target,+e.target.dataset.target);cntObs.unobserve(e.target);}});
},{threshold:.5});
countEls.forEach(el=>cntObs.observe(el));

// Hero counters animate on load
setTimeout(()=>{animCount(document.getElementById('cnt1'),3,1200);},1400);
setTimeout(()=>{animCount(document.getElementById('cnt2'),3,1600);},1500);
setTimeout(()=>{animCount(document.getElementById('cnt3'),7,2000);},1600);

/* ══════ HERO TITLE REVEAL ══════ */
setTimeout(()=>{document.getElementById('hw1').style.animation='wordSlide 1s .0s cubic-bezier(.22,1,.36,1) both';},100);
setTimeout(()=>{document.getElementById('hw2').style.animation='wordSlide 1s .15s cubic-bezier(.22,1,.36,1) both';},100);

/* ══════ PORTFOLIO FILTER ══════ */
document.querySelectorAll('.pf-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.pf-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const f=btn.dataset.filter;
    const cards=[...document.querySelectorAll('.port-card')];
    cards.forEach((card,i)=>{
      const show=f==='all'||card.dataset.cat===f;
      card.style.transition=`opacity .45s ${i*.05}s, transform .45s ${i*.05}s`;
      if(show){card.style.opacity='1';card.style.transform='scale(1)';card.style.pointerEvents='';setTimeout(()=>card.style.display='',50);}
      else{card.style.opacity='0';card.style.transform='scale(.88)';card.style.pointerEvents='none';setTimeout(()=>{if(card.dataset.cat!==f&&f!=='all')card.style.display='none';},500);}
    });
  });
});

/* ══════ FORM SUBMIT ══════ */
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const btnLoader = document.getElementById('btnLoader');

contactForm.addEventListener('submit', function(e) {
  e.preventDefault();
  if (submitBtn.classList.contains('sending') || submitBtn.classList.contains('sent')) return;
  
  submitBtn.classList.add('sending');
  submitBtn.querySelector('.btn-label').textContent = 'Sending...';
  btnLoader.style.width = '100%';
  
  const formData = new FormData(this);
  
  fetch("https://formsubmit.co/ajax/govindsingh.6953.j2@gmail.com", {
    method: "POST",
    body: formData,
    headers: { 'Accept': 'application/json' }
  })
  .then(response => response.json())
  .then(data => {
    submitBtn.classList.remove('sending');
    submitBtn.classList.add('sent');
    submitBtn.querySelector('.btn-label').textContent = '✓ Message Sent!';
    btnLoader.style.width = '0';
    this.reset();
    setTimeout(() => {
      submitBtn.classList.remove('sent');
      submitBtn.querySelector('.btn-label').textContent = 'Send Message';
    }, 3500);
  })
  .catch(error => {
    submitBtn.classList.remove('sending');
    submitBtn.querySelector('.btn-label').textContent = 'Error! Try again.';
    btnLoader.style.width = '0';
    setTimeout(() => {
      submitBtn.querySelector('.btn-label').textContent = 'Send Message';
    }, 3500);
  });
});

/* ══════ PARALLAX HERO ══════ */
window.addEventListener('scroll',()=>{
  const s=window.scrollY;
  const orbs=document.querySelectorAll('.orb');
  orbs[0] && (orbs[0].style.transform=`translate(${s*.04}px,${s*.08}px) scale(1)`);
  orbs[1] && (orbs[1].style.transform=`translate(${-s*.03}px,${-s*.05}px) scale(1)`);
  const heroContent=document.querySelector('.hero-content');
  if(heroContent&&s<window.innerHeight)heroContent.style.transform=`translateY(${s*.12}px)`;
},{passive:true});

/* ══════ MAGNETIC BUTTONS ══════ */
document.querySelectorAll('.btn-solid,.btn-ghost,.nav-btn,.btn-submit').forEach(btn=>{
  btn.addEventListener('mousemove',e=>{
    const r=btn.getBoundingClientRect();
    const x=e.clientX-r.left-r.width/2;
    const y=e.clientY-r.top-r.height/2;
    btn.style.transform=`translate(${x*.2}px,${y*.2}px) translateY(-2px)`;
  });
  btn.addEventListener('mouseleave',()=>{btn.style.transform='';});
});

/* ══════ TEXT SCRAMBLE on sec-labels ══════ */
const chars='!@#$%^&*ABCDEFGHIJabcdefghij0123456789';
document.querySelectorAll('.sec-label').forEach(el=>{
  const orig=el.textContent.trim();
  const scObs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        let iter=0;const total=20;
        const id=setInterval(()=>{
          el.textContent=orig.split('').map((ch,i)=>{
            if(ch===' ')return ' ';
            if(i<iter/total*orig.length)return orig[i];
            return chars[Math.floor(Math.random()*chars.length)];
          }).join('');
          if(++iter>total){el.textContent=orig;clearInterval(id);}
        },40);
        scObs.unobserve(el);
      }
    });
  },{threshold:.8});
  scObs.observe(el);
});

/* ══════ CARD TILT ══════ */
document.querySelectorAll('.svc,.port-card,.test-card').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5;
    const y=(e.clientY-r.top)/r.height-.5;
    card.style.transform=`perspective(600px) rotateY(${x*6}deg) rotateX(${-y*6}deg) translateY(-8px) scale(1.01)`;
  });
  card.addEventListener('mouseleave',()=>{card.style.transform='';});
});

/* ══════ RIPPLE on CLICK ══════ */
document.querySelectorAll('.btn-solid,.nav-btn,.btn-submit').forEach(btn=>{
  btn.addEventListener('click',e=>{
    const r=btn.getBoundingClientRect();
    const rip=document.createElement('span');
    rip.style.cssText=`position:absolute;width:4px;height:4px;border-radius:50%;
      background:rgba(255,255,255,.4);left:${e.clientX-r.left}px;top:${e.clientY-r.top}px;
      transform:translate(-50%,-50%) scale(0);animation:ripple .6s ease-out forwards;pointer-events:none;`;
    btn.style.position='relative';btn.style.overflow='hidden';
    btn.appendChild(rip);setTimeout(()=>rip.remove(),700);
  });
});
// inject ripple keyframes
const style=document.createElement('style');
style.textContent='@keyframes ripple{to{transform:translate(-50%,-50%) scale(120);opacity:0;}}';
document.head.appendChild(style);

/* PAGE LOADER — removed for direct page load */

/* ══════ TYPEWRITER on hero subtitle ══════ */
(function(){
  const roles=['Software Engineer','Full-Stack Developer','Gen AI Explorer','Problem Solver'];
  let ri=0,ci=0,deleting=false;
  const el=document.querySelector('.hero-name');
  if(!el)return;
  const baseText='Govind Singh';
  const roleEl=document.createElement('span');
  roleEl.style.cssText='color:#ff6200;display:block;font-size:.95rem;font-weight:500;margin-top:2px;min-height:1.4em;';
  el.after(roleEl);
  function type(){
    const role=roles[ri];
    if(!deleting){
      roleEl.textContent=role.slice(0,++ci);
      if(ci===role.length){deleting=true;setTimeout(type,1800);return;}
    } else {
      roleEl.textContent=role.slice(0,--ci);
      if(ci===0){deleting=false;ri=(ri+1)%roles.length;}
    }
    setTimeout(type,deleting?50:90);
  }
  setTimeout(type,2200);
})();

/* ══════ CURSOR TRAIL SPARKS ══════ */
(function(){
  const sparks=[];
  document.addEventListener('mousemove',e=>{
    if(Math.random()>.7){
      const sp=document.createElement('div');
      sp.style.cssText=`position:fixed;left:${e.clientX}px;top:${e.clientY}px;
        width:${Math.random()*5+2}px;height:${Math.random()*5+2}px;
        border-radius:50%;background:rgba(255,98,0,${Math.random()*.6+.2});
        pointer-events:none;z-index:9990;transform:translate(-50%,-50%);
        animation:sparkFade ${Math.random()*.4+.3}s ease-out forwards;`;
      document.body.appendChild(sp);
      setTimeout(()=>sp.remove(),700);
    }
  });
  const sk=document.createElement('style');
  sk.textContent=`@keyframes sparkFade{
    0%{transform:translate(-50%,-50%) scale(1);opacity:1;}
    100%{transform:translate(calc(-50% + ${(Math.random()-.5)*40}px),calc(-50% - ${Math.random()*30+10}px)) scale(0);opacity:0;}
  }`;
  document.head.appendChild(sk);
})();

/* ══════ SECTION ENTRY — orange line sweep ══════ */
(function(){
  const secs=document.querySelectorAll('section');
  const lStyle=document.createElement('style');
  lStyle.textContent=`
    .sec-sweep-line{position:absolute;top:0;left:0;width:0;height:2px;
      background:linear-gradient(90deg,transparent,#ff6200,transparent);
      z-index:10;pointer-events:none;transition:width 1.2s cubic-bezier(.22,1,.36,1);}
    .sec-sweep-line.sweep{width:100%;}
  `;
  document.head.appendChild(lStyle);
  secs.forEach(sec=>{
    const line=document.createElement('div');
    line.className='sec-sweep-line';
    sec.style.position='relative';
    sec.prepend(line);
    const obs=new IntersectionObserver(entries=>{
      entries.forEach(e=>{if(e.isIntersecting){line.classList.add('sweep');obs.unobserve(sec);}});
    },{threshold:.05});
    obs.observe(sec);
  });
})();

/* ══════ STAGGERED LETTER REVEAL for section titles ══════ */
(function(){
  document.querySelectorAll('.sec-title').forEach(el=>{
    const text=el.innerHTML;
    // Split text nodes and entities, preserving HTML tags like <br>
    el.innerHTML=text.replace(/(<[^>]*>)|(&[a-zA-Z0-9#]+;)|([^\s<])/g, function(m, tag, ent, char) {
      if(tag) return tag;
      return '<span class="lttr" style="display:inline-block;opacity:0;transform:translateY(20px) rotate(-3deg);transition:opacity .5s,transform .5s;">' + (ent || char) + '</span>';
    });
    const obs=new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          e.target.querySelectorAll('.lttr').forEach((lt,i)=>{
            lt.style.transitionDelay=(i*.025)+'s';
            requestAnimationFrame(()=>{lt.style.opacity='1';lt.style.transform='none';});
          });
          obs.unobserve(e.target);
        }
      });
    },{threshold:.3});
    obs.observe(el);
  });
})();

/* ══════ HORIZONTAL SCROLL HINT on portfolio ══════ */
(function(){
  const grid=document.getElementById('portGrid');
  if(!grid)return;
  // Number counter on card hover
  document.querySelectorAll('.port-card').forEach((card,i)=>{
    const num=document.createElement('div');
    num.textContent=String(i+1).padStart(2,'0');
    num.style.cssText=`position:absolute;top:10px;left:12px;
      font-family:'Bebas Neue',cursive;font-size:1.1rem;letter-spacing:.06em;
      color:rgba(255,98,0,.5);z-index:5;pointer-events:none;`;
    card.querySelector('.port-thumb').style.position='relative';
    card.querySelector('.port-thumb').appendChild(num);
  });
})();

/* ══════ FLOATING NAV DOTS (section indicator) ══════ */
(function(){
  const sections=['hero','services','about','portfolio','testimonials','contact'];
  const dotWrap=document.createElement('div');
  dotWrap.style.cssText=`position:fixed;right:1.5rem;top:50%;transform:translateY(-50%);
    display:flex;flex-direction:column;gap:10px;z-index:300;`;
  sections.forEach(id=>{
    const dot=document.createElement('div');
    dot.dataset.sec=id;
    dot.style.cssText=`width:7px;height:7px;border-radius:50%;
      background:rgba(255,255,255,.15);cursor:pointer;
      transition:all .3s cubic-bezier(.34,1.56,.64,1);border:1px solid rgba(255,98,0,.2);`;
    dot.title=id.charAt(0).toUpperCase()+id.slice(1);
    dot.addEventListener('click',()=>document.getElementById(id)?.scrollIntoView({behavior:'smooth'}));
    dot.addEventListener('mouseenter',()=>dot.style.transform='scale(1.6)');
    dot.addEventListener('mouseleave',()=>dot.style.transform='');
    dotWrap.appendChild(dot);
  });
  document.body.appendChild(dotWrap);

  // Update active dot on scroll
  window.addEventListener('scroll',()=>{
    const s=window.scrollY;
    sections.forEach(id=>{
      const sec=document.getElementById(id);
      if(!sec)return;
      const dot=dotWrap.querySelector(`[data-sec="${id}"]`);
      if(s>=sec.offsetTop-200&&s<sec.offsetTop+sec.offsetHeight-200){
        dot.style.background='#ff6200';
        dot.style.boxShadow='0 0 8px rgba(255,98,0,.6)';
        dot.style.width='9px';dot.style.height='9px';
      } else {
        dot.style.background='rgba(255,255,255,.15)';
        dot.style.boxShadow='';
        dot.style.width='7px';dot.style.height='7px';
      }
    });
  },{passive:true});

  // Hide on mobile
  const ms=document.createElement('style');
  ms.textContent='@media(max-width:768px){#'+dotWrap.id+'{display:none;}}';
  dotWrap.id='nav-dots';
  ms.textContent='@media(max-width:768px){#nav-dots{display:none;}}';
  document.head.appendChild(ms);
})();

/* ══════ SMOOTH HOVER GLOW FOLLOW on cards ══════ */
document.querySelectorAll('.svc,.port-card').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    const x=((e.clientX-r.left)/r.width)*100;
    const y=((e.clientY-r.top)/r.height)*100;
    card.style.setProperty('--mx',x+'%');
    card.style.setProperty('--my',y+'%');
  });
});
// Inject glow style
const glowStyle=document.createElement('style');
glowStyle.textContent=`
  .svc,.port-card{--mx:50%;--my:50%;}
  .svc::after,.port-card::after{
    content:'';position:absolute;
    width:200px;height:200px;border-radius:50%;
    background:radial-gradient(circle,rgba(255,98,0,.08) 0%,transparent 70%);
    left:calc(var(--mx) - 100px);top:calc(var(--my) - 100px);
    pointer-events:none;transition:left .1s,top .1s;z-index:0;
  }
  .svc{overflow:hidden;}
`;
document.head.appendChild(glowStyle);

/* ══════ STATS COUNT UP on scroll ══════ */
(function(){
  const strip=document.getElementById('counter-strip');
  if(!strip)return;
  const nums=strip.querySelectorAll('[data-target]');
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        nums.forEach(el=>{
          const target=+el.dataset.target;
          let start=null;
          function step(ts){
            if(!start)start=ts;
            const p=Math.min((ts-start)/1600,1);
            const ease=1-Math.pow(1-p,3);
            el.textContent=Math.floor(ease*target);
            if(p<1)requestAnimationFrame(step);else el.textContent=target;
          }
          requestAnimationFrame(step);
        });
        obs.unobserve(strip);
      }
    });
  },{threshold:.4});
  obs.observe(strip);
})();

/* ══════ NAV LINK MAGNETIC HOVER ══════ */
document.querySelectorAll('.nav-links a').forEach(link=>{
  link.addEventListener('mousemove',e=>{
    const r=link.getBoundingClientRect();
    const x=(e.clientX-r.left-r.width/2)*.3;
    const y=(e.clientY-r.top-r.height/2)*.3;
    link.style.transform=`translate(${x}px,${y}px)`;
  });
  link.addEventListener('mouseleave',()=>link.style.transform='');
});

/* ══════ HERO IMAGE — mouse parallax ══════ */
document.addEventListener('mousemove',e=>{
  const col=document.querySelector('.hero-img-col');
  if(!col)return;
  const cx=window.innerWidth/2,cy=window.innerHeight/2;
  const dx=(e.clientX-cx)/cx*10,dy=(e.clientY-cy)/cy*8;
  col.style.transform=`translate(${dx}px,${dy}px)`;
});

/* ══════ FORM FIELD ANIMATED LABELS ══════ */
document.querySelectorAll('.fg input,.fg textarea,.fg select').forEach(inp=>{
  inp.addEventListener('focus',()=>{
    inp.parentElement.querySelector('label').style.color='#ff6200';
  });
  inp.addEventListener('blur',()=>{
    inp.parentElement.querySelector('label').style.color='';
  });
});

/* ══════ SCROLL-TRIGGERED ORANGE FLASH on body ══════ */
(function(){
  let lastY=0;
  window.addEventListener('scroll',()=>{
    const y=window.scrollY;
    if(Math.abs(y-lastY)>300){
      document.body.style.transition='background .15s';
      document.body.style.background='#0f0a05';
      setTimeout(()=>{document.body.style.background='';},200);
    }
    lastY=y;
  },{passive:true});
})();

/* ══════ SERVICE CARD NUMBER COUNTER ══════ */
document.querySelectorAll('.svc').forEach((card,i)=>{
  card.setAttribute('data-num',String(i+1).padStart(2,'0'));
});

/* ══════ SMOOTH ANCHOR with offset ══════ */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const tgt=document.querySelector(a.getAttribute('href'));
    if(!tgt)return;
    e.preventDefault();
    const top=tgt.getBoundingClientRect().top+window.scrollY-78;
    window.scrollTo({top,behavior:'smooth'});
  });
});