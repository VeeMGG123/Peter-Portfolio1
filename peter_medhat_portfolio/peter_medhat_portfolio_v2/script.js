document.getElementById("year").textContent = new Date().getFullYear();
const form = document.getElementById("contact-form");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const subject = encodeURIComponent("طلب مشروع جديد من " + data.get("name"));
  const body = encodeURIComponent(
    "الاسم: " + data.get("name") + "\n" +
    "الإيميل: " + data.get("email") + "\n\n" +
    "تفاصيل الفكرة:\n" + data.get("message")
  );
  window.location.href = "mailto:PETER.MEDHAT@GMAIL.COM?subject=" + subject + "&body=" + body;
});

// Scroll reveals, progress indicator, ambient pointer glow, and subtle desktop card tilt.
document.documentElement.classList.add("reveal-ready");
const progress = document.createElement("div"); progress.className = "scroll-progress"; document.body.appendChild(progress);
const glow = document.createElement("div"); glow.className = "cursor-glow"; document.body.appendChild(glow);
const revealTargets = document.querySelectorAll(".feature, .statement p, .section-heading, .service, .question-icons, .question>div, .why>*:not(.floating-badges), .cta>*:not(.floating-badges), .contact-copy, .contact-form");
revealTargets.forEach((el,index)=>{el.classList.add("reveal"); if(el.classList.contains("service")||el.classList.contains("feature")) el.style.transitionDelay=`${(index%4)*85}ms`;});
if("IntersectionObserver" in window){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target);}});},{threshold:.13,rootMargin:"0px 0px -35px 0px"});revealTargets.forEach(el=>observer.observe(el));}else{revealTargets.forEach(el=>el.classList.add("is-visible"));}
let scrollTick=false; function updateProgress(){const max=document.documentElement.scrollHeight-window.innerHeight;progress.style.width=`${max>0?(window.scrollY/max)*100:0}%`;scrollTick=false;}
window.addEventListener("scroll",()=>{if(!scrollTick){window.requestAnimationFrame(updateProgress);scrollTick=true;}},{passive:true});updateProgress();
window.addEventListener("pointermove",event=>{glow.style.left=`${event.clientX}px`;glow.style.top=`${event.clientY}px`;},{passive:true});
if(window.matchMedia("(hover:hover) and (pointer:fine)").matches){document.querySelectorAll(".feature").forEach(card=>{card.addEventListener("pointermove",event=>{const rect=card.getBoundingClientRect();const x=(event.clientX-rect.left)/rect.width-.5;const y=(event.clientY-rect.top)/rect.height-.5;card.style.transform=`translateY(-4px) perspective(800px) rotateX(${-y*2.5}deg) rotateY(${x*2.5}deg)`;});card.addEventListener("pointerleave",()=>{card.style.transform="";});});}
