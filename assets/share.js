(function(){var d=document;
var M="sun sunHrs,v sysV,days daysAuto,dod maxDod|cont invCont,kind invKind,iv invV|watts ccWatts,cv ccV,type ccType|ah pvAh,pv pvV,psun pvSun,panel pvPanel".split("|").map(function(s){return s.split(",").map(function(x){return x.split(" ")})});
var F=["sizeSystem","sizeInverter","sizeController","panelsForBattery"],K=["sys","inv","cc","pv"],V="12,24,48";
function n(s){return s!=null&&/^\d+(\.\d+)?$/.test(s)?+s:null}
function inn(s,a){return s!=null&&~a.split(",").indexOf(s)}
function ge(s,a,b){var x=n(s);return x!=null&&x>=a&&(b==null||x<=b)}
function pi(nm){for(var i=0;i<PRESETS.length;i++)if(PRESETS[i].name==nm)return i;return-1}
function lq(){return loads.map(function(r){return[pi(r.name),r.w,r.hrs,r.qty].join(":")}).join(",")}
function parseL(raw){var o=[],p=raw.split(","),i,b,w,h,q,x;for(i=0;i<p.length;i++){b=p[i].split(":");w=n(b[1]);h=n(b[2]);q=n(b[3]);x=b[0]=="-1"?-1:n(b[0]);if(b.length!=4||w==null||h==null||q==null||q<1||x==null||x>=0&&(x%1||x>=PRESETS.length||""+x!=b[0]))return;o.push({name:x<0?"Custom load":PRESETS[x].name,w:w,hrs:h,qty:q})}return o.length&&o}
function ok(i,q){function g(k){return q.get(k)}if(!i)return ge(g("sun"),1,8)&&inn(g("v"),V)&&ge(g("days"),1,5)&&inn(g("dod"),"0.8,0.5");if(i<2)return ge(g("cont"),1e-9)&&inn(g("kind"),"resistive,motor,compressor,mixed")&&inn(g("iv"),V);if(i<3)return ge(g("watts"),1)&&inn(g("cv"),V)&&inn(g("type"),"mppt,pwm");return ge(g("ah"),1)&&inn(g("pv"),V)&&ge(g("psun"),1,8)&&inn(g("panel"),"100,200,300,400,450")}
function go(i){var q=new URLSearchParams();q.set("tab",K[i]);M[i].forEach(function(p){q.set(p[0],el(p[1]).value)});if(!i)q.set("l",lq());history.replaceState(null,"",location.pathname+"?"+q)}
function copy(s,st){function ok(){st.textContent="Copied"}function fb(){var t=d.createElement("textarea");t.value=s;t.style.cssText="position:fixed;left:-9999px";d.body.appendChild(t);t.select();try{d.execCommand("copy")}catch(e){}t.remove();ok()}var c=navigator.clipboard;c&&c.writeText?c.writeText(s).then(ok,fb):fb()}
function btns(box){var o=box.querySelector(".sa");if(o)o.remove();var tx=box.textContent.trim(),w=d.createElement("div"),s;w.className="sa";w.innerHTML="<button type=button class=sb>Copy link to this result</button><button type=button class=sb>Copy as text</button><span role=status></span>";s=w.lastChild;w.children[0].onclick=function(){copy(location.href,s)};w.children[1].onclick=function(){copy("SolarSizer\n"+tx+"\n"+location.href,s)};box.appendChild(w)}
function hook(i){var o=window[F[i]];window[F[i]]=function(){o();var box=el(K[i]+"Result");if(!box||box.hidden)return;go(i);btns(box)}}
function apply(){var q=new URLSearchParams(location.search),i=K.indexOf(q.get("tab")),rows;if(i<0||!ok(i,q))return;if(!i&&q.has("l")){rows=parseL(q.get("l"));if(!rows)return;loads.length=0;[].push.apply(loads,rows);renderLoads()}M[i].forEach(function(p){el(p[1]).value=q.get(p[0])});showTab("tab-"+K[i],d.querySelectorAll("#calc button")[i]);window[F[i]]()}
[0,1,2,3].forEach(hook);d.addEventListener("DOMContentLoaded",apply)})();
