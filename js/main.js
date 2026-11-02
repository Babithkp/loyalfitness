(function(){
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;

// loader
function ready(){$('#loader').classList.add('done');document.body.classList.add('ready')}
addEventListener('load',()=>setTimeout(ready,900));setTimeout(ready,3000);

// menu
const burger=$('#burger'),sheet=$('#sheet');
function toggle(o){document.body.classList.toggle('open',o);burger.setAttribute('aria-expanded',o);sheet.setAttribute('aria-hidden',!o)}
burger.addEventListener('click',()=>toggle(!document.body.classList.contains('open')));
sheet.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>toggle(false)));

// stagger groups
$$('.cards,.facts,.plans,.points,.checks,.faq-list,.hero-cta,.crew').forEach(g=>[...g.querySelectorAll('.rv')].forEach((c,i)=>c.style.transitionDelay=(i*90)+'ms'));

// reveal
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
$$('.rv').forEach(el=>io.observe(el));
// big titles light up
const bio=new IntersectionObserver(es=>es.forEach(e=>e.target.classList.toggle('lit',e.isIntersecting)),{rootMargin:'-30% 0px -30% 0px'});
$$('.big').forEach(el=>bio.observe(el));

// statement word reveal
const st=$('#statement');const parts=[];
st.childNodes.forEach(n=>{if(n.nodeType===3){n.textContent.split(/(\s+)/).forEach(w=>parts.push(w.trim()?`<span class="w">${w}</span>`:w))}else parts.push(`<span class="w g">${n.textContent}</span>`)});
st.innerHTML=parts.join('');const words=[...st.querySelectorAll('.w')];

// scroll loop (rAF throttled)
const nav=$('#nav'),prog=$('#progress'),fab=$('.fab'),hero=$('#heroImg');let tick=false;
function frame(){const y=scrollY,h=document.documentElement.scrollHeight-innerHeight;
  prog.style.transform=`scaleX(${h>0?y/h:0})`;nav.classList.toggle('solid',y>40);fab.classList.toggle('show',y>innerHeight*.6);
  if(!reduce&&y<innerHeight*1.2)hero.style.transform=`translate3d(0,${y*.25}px,0)`;
  const r=st.getBoundingClientRect();if(r.top<innerHeight&&r.bottom>0){const p=(innerHeight*.75-r.top)/(r.height+innerHeight*.2);const n=Math.round(p*words.length);words.forEach((w,i)=>w.classList.toggle('lit',i<n))}
  tick=false}
addEventListener('scroll',()=>{if(!tick){tick=true;requestAnimationFrame(frame)}},{passive:true});frame();

// active nav
const links=$$('.nl a');
const sio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)links.forEach(l=>{const on=l.getAttribute('href')==='#'+e.target.id;l.classList.toggle('on',on);on?l.setAttribute('aria-current','page'):l.removeAttribute('aria-current')})}),{rootMargin:'-45% 0px -50% 0px'});
['top','story','programs'].forEach(id=>sio.observe(document.getElementById(id)));

// pointer effects
if(matchMedia('(hover:hover) and (pointer:fine)').matches&&!reduce){
  $$('.btn-gold,.btn-wa,.btn-line,.btn-dark').forEach(b=>{
    b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.18}px,${(e.clientY-r.top-r.height/2)*.3}px)`});
    b.addEventListener('pointerleave',()=>b.style.transform='')});
  $$('.pcard,.plan,.fact').forEach(c=>{
    c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform=`perspective(900px) rotateX(${y*-5}deg) rotateY(${x*5}deg) translateY(-6px)`});
    c.addEventListener('pointerleave',()=>c.style.transform='')});
  const tags=$('.tags');if(tags)$('.stage').addEventListener('pointermove',e=>{const r=e.currentTarget.getBoundingClientRect();tags.style.transform=`translate(${(e.clientX-r.left-r.width/2)*-.02}px,${(e.clientY-r.top-r.height/2)*-.02}px)`});
}

})();
