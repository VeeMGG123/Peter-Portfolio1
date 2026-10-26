(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  // White opening screen with real character-by-character typing before the portfolio starts.
  const opening = $('#opening-screen');
  const introLines = [
    {el: $('#opening-typed-1'), text: 'أهلاً، أنا بيتر مدحت.'},
    {el: $('#opening-typed-2'), text: 'ببني تجارب ويب تتحرك معاك.'}
  ];
  const introFoot = $('#opening-foot');
  let introReady = false;
  if (opening) {
    const typeLine = (item, speed) => new Promise(resolve => {
      let i = 0;
      const step = () => {
        if (!item.el || i >= item.text.length) { resolve(); return; }
        item.el.textContent = item.text.slice(0, ++i);
        setTimeout(step, speed + (item.text[i-1] === ' ' ? 65 : 0));
      };
      step();
    });
    (async () => {
      await new Promise(r => setTimeout(r, 450));
      await typeLine(introLines[0], 82);
      await new Promise(r => setTimeout(r, 350));
      await typeLine(introLines[1], 58);
      if (introFoot) introFoot.textContent = 'SCROLL TO ENTER  ↓';
      await new Promise(r => setTimeout(r, 950));
      opening.classList.add('is-done');
      introReady = true;
    })();
  } else introReady = true;
  const hero = $('.hero');
  const heroStage = $('.hero-scroll-stage');
  const sections = $$('main > .section');
  const footer = $('body > footer');
  // The footer is intentionally not a separate scene: the last scene is the contact section.
  const scenes = [hero, ...sections].filter(Boolean);
  if (footer) footer.style.display = 'none';
  const progress = $('.progress i');
  const dock = $('.floating-dock');
  const cards = $$('.mini-card');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
  const smooth=v=>{v=clamp(v);return v*v*(3-2*v)};
  const ease=v=>{v=clamp(v);return v<.5?4*v*v*v:1-Math.pow(-2*v+2,3)/2};
  const max=scenes.length-1;
  let current=0,target=0,raf=0,touchY=0,lastWheel=0;
  document.documentElement.style.overflow='hidden';document.body.style.overflow='hidden';
  if ('scrollRestoration' in history) history.scrollRestoration='manual';
  window.scrollTo(0,0);
  function requestRender(){if(!raf)raf=requestAnimationFrame(tick)}
  function tick(){raf=0;current += (target-current)*(reduce?1:.075);if(Math.abs(target-current)<.0005)current=target;render(current);if(current!==target)raf=requestAnimationFrame(tick)}
  function move(delta){target=clamp(target+delta/820,0,max);requestRender()}
  function set(el,props){if(el)Object.assign(el.style,props)}
  function render(t){
    const vh=innerHeight, vw=innerWidth;
    // Keep exactly ONE scene visible at a time. The old distance-based opacity
    // made neighboring fixed sections overlap during every transition.
    const activeIndex = Math.max(0, Math.min(max, Math.floor(t + 0.5)));
    scenes.forEach((scene,i)=>{
      const d=t-i, distance=Math.abs(d), active=clamp(1-distance);
      const isActive = i === activeIndex;
      const y = isActive ? 0 : (d > 0 ? -vh*.04 : vh*.04);
      const scale = isActive ? 1 : .985;
      const rotate = isActive ? 0 : (d > 0 ? -0.5 : 0.5);
      scene.style.opacity = isActive ? '1' : '0';
      scene.style.transform=`translate3d(0,${y}px,0) perspective(1200px) rotateX(${rotate}deg) scale(${scale})`;
      scene.style.visibility = isActive ? 'visible' : 'hidden';
      scene.style.pointerEvents = isActive && active > .25 ? 'auto' : 'none';
      scene.style.zIndex = isActive ? '100' : '0';
      if(scene===hero && heroStage){heroStage.style.pointerEvents=isActive?'auto':'none';}
      if(i>0) animateScene(scene,active,i,t,vw,vh);
    });
    // Hero choreography is directly scrubbed by the wheel timeline.
    const hp=smooth(clamp(t/.95));
    const tr=$('.title-right'),tl=$('.title-left'),portrait=$('.portrait-wrap');
    set(tr,{translate:`${vw*.12*hp}px ${-vh*.06*hp}px`,rotate:`${-5*hp}deg`,opacity:String(1-.15*hp)});
    set(tl,{translate:`${-vw*.12*hp}px ${-vh*.035*hp}px`,rotate:`${5*hp}deg`,opacity:String(1-.12*hp)});
    set(portrait,{translate:`-50% ${-vh*.18*hp}px`,scale:String(1-.32*hp),opacity:String(1-hp)});
    set($('.hero-caption'),{translate:`-50% ${-vh*.06*hp}px`,opacity:String(1-hp)});
    set($('.hero-bottom'),{translate:`0 ${vh*.08*hp}px`,opacity:String(1-hp)});
    cards.forEach((card,i)=>{
      const c=i-1.5, mobile=vw<700, fan=smooth(clamp(t/.88));
      const x=c*(mobile?vw*.08:vw*.12)*fan;
      const y=-vh*.23*fan+Math.abs(c)*10*fan;
      const z=(3-Math.abs(c))*54*fan;
      const rot=[-18,-6,6,18][i]*fan;
      const yaw=c*(mobile?6:14)*fan;
      const s=1-.23*fan;
      card.style.transform=`translate3d(${x}px,${y}px,${z}px) rotateX(${[10,4,-4,-10][i]*fan}deg) rotateY(${yaw}deg) rotateZ(${rot}deg) scale(${s})`;
      card.style.opacity=String(1-.08*fan);card.style.zIndex=String(30+Math.round(z));
    });
    if(progress)progress.style.width=`${(t/max)*100}%`;
    if(dock){dock.style.opacity=String(.72+.28*clamp(t));dock.style.translate=`0 ${Math.sin(t*2)*2}px`}
    if(footer) footer.style.display='none';
    document.body.dataset.scene=String(Math.min(max,Math.floor(t+.0001)));
  }
  function animateScene(scene,p,index,t,vw,vh){
    const reveals=$$('.reveal',scene);
    reveals.forEach((el,j)=>{
      const start=.04+(j%5)*.045, q=ease(clamp((p-start)/.60));
      const side=j%2===0?1:-1;
      el.style.opacity=String(q);
      el.style.transform=`translate3d(${side*(1-q)*Math.min(44,vw*.055)}px,${(1-q)*(j%3===0?24:-18)}px,0) scale(${.96+.04*q})`;
      el.style.filter=`blur(${(1-q)*4}px)`;
    });
    $$('.app-icon',scene).forEach((el,j)=>{
      const phase=p*Math.PI*2+j*1.55+index*.75;
      el.style.transform=`translate3d(${Math.sin(phase)*Math.min(35,vw*.035)}px,${Math.cos(phase*1.1)*Math.min(30,vh*.04)}px,0) rotate(${Math.sin(phase)*15}deg) scale(${.72+.28*p})`;
      el.style.opacity=String(.25+.75*p);
    });
    const stamp=$('.what-stamp',scene);if(stamp)stamp.style.transform=`translate3d(${(1-p)*-vw*.07}px,${(1-p)*vh*.035}px,0) rotate(${(1-p)*-28+p*5}deg) scale(${.75+.25*p})`;
    $$('.what-row',scene).forEach((el,j)=>{const q=ease(clamp((p-.08-j*.12)/.62));el.style.transform=`translate3d(${(1-q)*(j===0?vw*.07:-vw*.07)}px,${(1-q)*12}px,0) scale(${.95+.05*q})`;el.style.opacity=String(q)});
    $$('.question-line',scene).forEach((el,j)=>{const dir=j%2===0?-1:1;el.style.transform=`translate3d(${dir*(1-p)*vw*.11}px,${(1-p)*vh*.025}px,0) scale(${.82+.18*p})`;el.style.letterSpacing=`${(1-p)*-.06}em`});
    $$('.question-bg',scene).forEach((el,j)=>{el.style.transform=`translate3d(${Math.sin(p*2+j)*vw*.045}px,${(1-p)*vh*.06}px,0) scale(${.88+.12*p})`;el.style.opacity=String(.05+.18*p)});
    $$('.work-card',scene).forEach((el,j)=>{const q=ease(clamp((p-.04-j*.075)/.62));el.style.transform=`translate3d(0,${(1-q)*(j%2?vh*.10:-vh*.10)}px,0) rotate(${(1-q)*(j-1)*8}deg) scale(${.86+.14*q})`;el.style.opacity=String(q)});
    const copy=$('.contact-copy',scene),form=$('.contact-form',scene);
    if(copy)copy.style.transform=`translate3d(${(1-p)*-vw*.07}px,0,0) scale(${.94+.06*p})`;
    if(form)form.style.transform=`translate3d(${(1-p)*vw*.07}px,${(1-p)*vh*.025}px,0) scale(${.94+.06*p})`;
  }
  addEventListener('wheel',e=>{e.preventDefault();if(!introReady)return;const now=performance.now();let delta=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?innerHeight:1);if(Math.abs(delta)>0){move(delta);lastWheel=now}},{passive:false});
  addEventListener('keydown',e=>{if(!introReady && ['ArrowDown','PageDown',' ','ArrowUp','PageUp','Home','End'].includes(e.key)){e.preventDefault();return}if(['ArrowDown','PageDown',' '].includes(e.key)){e.preventDefault();move(720)}else if(['ArrowUp','PageUp'].includes(e.key)){e.preventDefault();move(-720)}else if(e.key==='Home'){e.preventDefault();target=0;requestRender()}else if(e.key==='End'){e.preventDefault();target=max;requestRender()}});
  addEventListener('touchstart',e=>{touchY=e.touches[0].clientY},{passive:true});
  addEventListener('touchmove',e=>{e.preventDefault();if(!introReady)return;const y=e.touches[0].clientY;move((touchY-y)*1.2);touchY=y},{passive:false});
  addEventListener('resize',()=>render(current));
  function sceneIndexForLink(a){const hash=a.getAttribute('href');if(!hash||!hash.startsWith('#'))return -1;const targetEl=$(hash);if(!targetEl)return -1;if(targetEl===hero||targetEl.classList.contains('hero'))return 0;const section=targetEl.matches('section')?targetEl:targetEl.closest('section');if(section)return scenes.indexOf(section);if(targetEl===footer||targetEl.closest('footer'))return max;return -1}
  $$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const i=sceneIndexForLink(a);if(i>=0){e.preventDefault();target=i;requestRender()}}));
  const form=$('.contact-form'),toast=$('.toast');
  if(form)form.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(form);const subject=encodeURIComponent('Portfolio inquiry from '+d.get('name'));const body=encodeURIComponent('Name: '+d.get('name')+'\nEmail: '+d.get('email')+'\n\n'+d.get('message'));if(toast){toast.textContent='بدّل hello@example.com ببريدك الحقيقي قبل النشر.';toast.classList.add('show')}location.href='mailto:hello@example.com?subject='+subject+'&body='+body});
  render(0);
})();
