/* SolarSizer calculators — vanilla JS, no dependencies.
   Solar figures use published NREL sun-hour data, manufacturer panel/battery specs,
   and standard derating assumptions (75% overall system efficiency). All estimates
   rounded UP to be safe. Matches the GeneratorSizer app pattern. */
"use strict";

var PRESETS = [
  { name:"Refrigerator (Energy Star)",        w:150,  hrs:8    },
  { name:"LED lights, cabin",                 w:80,   hrs:5    },
  { name:"Laptop + phone charging",           w:100,  hrs:6    },
  { name:"Starlink / internet",               w:60,   hrs:12   },
  { name:"TV",                                w:100,  hrs:4    },
  { name:"CPAP machine",                      w:40,   hrs:8    },
  { name:"12 V water pump",                   w:60,   hrs:0.5  },
  { name:"Ceiling fan",                       w:60,   hrs:8    },
  { name:"Microwave",                         w:1000, hrs:0.25 },
  { name:"Induction cooktop (1 burner)",      w:1500, hrs:0.75 },
  { name:"Washing machine",                   w:500,  hrs:0.5  },
  { name:"Well pump — 1/2 HP",                w:1000, hrs:0.5  },
  { name:"Chest freezer",                     w:200,  hrs:8    },
  { name:"Security camera + router",          w:15,   hrs:24   }
];
// Load items the user has added: {name, w, hrs, qty}
var loads = [];

function el(id){ return document.getElementById(id); }
function fmt(n){ return Math.round(n).toLocaleString("en-US"); }
function ceilTo(n, step){ return Math.ceil(n/step)*step; }

/* ---------- Tabs ---------- */
function showTab(key, btn){
  document.querySelectorAll(".panel").forEach(function(p){ p.classList.remove("active"); });
  document.querySelectorAll(".tabs button").forEach(function(b){ b.setAttribute("aria-selected","false"); });
  el(key).classList.add("active");
  if(btn) btn.setAttribute("aria-selected","true");
}

/* ---------- Load builder ---------- */
function presetOptions(){
  var html = '<option value="">— pick a load —</option>';
  PRESETS.forEach(function(p,i){
    html += '<option value="'+i+'">'+p.name+" ("+fmt(p.w)+" W)</option>";
  });
  html += '<option value="custom">Custom…</option>';
  return html;
}

function addLoad(name, w, hrs){
  loads.push({ name:name||"Custom load", w:w||0, hrs:hrs||1, qty:1 });
  renderLoads();
}

function renderLoads(){
  var wrap = el("loadRows");
  if(!loads.length){
    wrap.innerHTML = '<p class="small">No loads yet — pick one above, or add a custom row.</p>';
  } else {
    var rows = "";
    loads.forEach(function(l,i){
      rows += '<div class="load-row">'+
        '<input type="text" value="'+l.name.replace(/"/g,"&quot;")+'" data-i="'+i+'" data-f="name" aria-label="Load name">'+
        '<input type="number" min="0" value="'+l.w+'" data-i="'+i+'" data-f="w" aria-label="Watts">'+
        '<input type="number" min="0" step="0.25" value="'+l.hrs+'" data-i="'+i+'" data-f="hrs" aria-label="Hours per day">'+
        '<input type="number" min="1" value="'+l.qty+'" data-i="'+i+'" data-f="qty" aria-label="Quantity">'+
        '<button class="del" data-del="'+i+'" aria-label="Remove '+l.name+'">✕</button>'+
      '</div>';
    });
    wrap.innerHTML = '<div class="load-row load-head"><span>Load</span><span class="num">Watts</span><span class="num">Hrs/day</span><span class="num">Qty</span><span></span></div>'+rows;
  }
  el("sysResult").hidden = true;
  el("sysResult").innerHTML = "";
}

document.addEventListener("click", function(e){
  var add = e.target.closest("[data-add]");
  if(add){
    var sel = el("presetSelect");
    if(sel.value === "") return;
    if(sel.value === "custom"){ addLoad("Custom load", 0, 1); }
    else { var p = PRESETS[+sel.value]; addLoad(p.name, p.w, p.hrs); }
    sel.value = "";
    return;
  }
  var del = e.target.closest("[data-del]");
  if(del){ loads.splice(+del.getAttribute("data-del"),1); renderLoads(); }
});
document.addEventListener("input", function(e){
  var inp = e.target.closest(".load-row input[data-f]");
  if(!inp) return;
  var i = +inp.getAttribute("data-i"), f = inp.getAttribute("data-f");
  loads[i][f] = f === "name" ? inp.value : Math.max(0, +inp.value || 0);
});

/* ---------- 1. System size ---------- */
// Array sizing: daily Wh ÷ sun hrs ÷ 0.75 overall efficiency (wiring, controller,
// battery round-trip, panel heat/soiling), rounded up to the next 100 W.
// Bank sizing: daily Wh × autonomy days ÷ max DoD.
function sizeSystem(){
  if(!loads.length){ alert("Add at least one load first."); return; }
  var sun   = Math.max(1, parseFloat(el("sunHrs").value) || 4);
  var sysV  = parseFloat(el("sysV").value) || 24;
  var days  = Math.max(1, parseFloat(el("daysAuto").value) || 2);
  var dod   = parseFloat(el("maxDod").value) || 0.8;

  var dailyWh = 0, worst = null, worstWh = 0;
  loads.forEach(function(l){
    var wh = l.w * l.hrs * l.qty;
    dailyWh += wh;
    if(wh > worstWh){ worstWh = wh; worst = l; }
  });

  var arrayW  = ceilTo(dailyWh / sun / 0.75, 100);
  var bankWh  = dailyWh * days / dod;
  var bankAh  = ceilTo(bankWh / sysV, 10);
  var panels300 = Math.ceil(arrayW / 300);
  var winterArray = ceilTo(dailyWh / 2.5 / 0.75, 100); // 2.5 sun-hr worst-case winter

  var html = '<div class="big">'+fmt(arrayW)+' <span class="unit">watts of solar panels</span></div>'+
    '<p class="note">Daily use '+fmt(dailyWh)+' Wh · '+sun+' sun hrs/day · 75% system efficiency. Largest single load: '+worst.name+' ('+fmt(worstWh)+' Wh/day).</p>'+
    '<div class="grid2">'+
      '<div class="stat"><b>'+panels300+'×</b><span>300 W panels to buy ('+fmt(panels300*300)+' W array)</span></div>'+
      '<div class="stat"><b>'+fmt(bankAh)+' Ah</b><span>Battery bank at '+sysV+' V ('+fmt(bankWh)+' Wh usable)</span></div>'+
      '<div class="stat"><b>'+days+'</b><span>Days of autonomy at '+Math.round(dod*100)+'% max DoD</span></div>'+
      '<div class="stat"><b>'+fmt(winterArray)+' W</b><span>Array if winter sun drops to 2.5 hrs</span></div>'+
      '<div class="stat"><b>'+fmt(Math.ceil(bankAh*sysV*0.15/100)*100)+' W</b><span>Min charge rate (0.15C) to keep the bank healthy</span></div>'+
      '<div class="stat"><b>≥ '+fmt(ceilTo(bankAh/100,1)*100)+' Ah</b><span>Common 100 Ah units to parallel</span></div>'+
    '</div>'+
    '<p class="note">Sizing rule of thumb: array watts ÷ battery volts ÷ 0.85 gives the charge controller amps — check the charge controller tab. If your winter sun hours are half your annual average, size the array to winter or accept generator/shore charging in the dark months.</p>';
  var box = el("sysResult"); box.hidden = false; box.innerHTML = html;
  if (window.updateMatchedCTA) window.updateMatchedCTA(arrayW, 'system');
}

/* ---------- 2. Inverter size ---------- */
function sizeInverter(){
  var cont = Math.max(0, parseFloat(el("invCont").value) || 0);
  if(!cont){ alert("Enter your total continuous AC load in watts."); return; }
  var kind = el("invKind").value;
  var f = kind === "resistive" ? 1 : kind === "motor" ? 3 : kind === "compressor" ? 4 : 2;
  var v = parseFloat(el("invV").value) || 24;
  var surgeNeed = cont * f;
  var contRec = ceilTo(cont * 1.25, 100);
  var surgeRec = ceilTo(surgeNeed * 1.1, 100);
  var dcAmps = cont / 0.92 / v;
  var box = el("invResult"); box.hidden = false;
  if (window.updateMatchedCTA) window.updateMatchedCTA(contRec, 'inverter');
  box.innerHTML = '<div class="big">'+fmt(contRec)+' W <span class="unit">continuous · '+fmt(surgeRec)+' W surge</span></div>'+
    '<div class="grid2">'+
      '<div class="stat"><b>'+fmt(cont)+'</b><span>Your continuous load</span></div>'+
      '<div class="stat"><b>'+f+'×</b><span>Surge factor ('+kind+' loads)</span></div>'+
      '<div class="stat"><b>'+dcAmps.toFixed(0)+' A</b><span>DC draw at '+v+' V (incl. ~8% inverter loss)</span></div>'+
      '<div class="stat"><b>'+fmt(v)+' V</b><span>Match inverter to bank voltage</span></div>'+
    '</div>'+
    '<p class="note">Pure sine wave only — modified-sine inverters run hot and kill compressor motors. Above 2,000 W continuous, prefer a 48 V bank: DC amps (and cable cost) drop by half each time you double voltage.</p>';
}

/* ---------- 3. Charge controller ---------- */
function sizeController(){
  var watts = Math.max(1, parseFloat(el("ccWatts").value) || 0);
  if(!watts){ alert("Enter your total array watts."); return; }
  var v = parseFloat(el("ccV").value) || 24;
  var type = el("ccType").value;
  var amps = watts / v / 0.85;   // charge inefficiency margin
  var std = [10,20,30,40,60,80,100];
  var rec = std.find(function(s){ return s >= amps; }) || Math.ceil(amps/20)*20;
  var mpptTip = type === "pwm" && watts > 200
    ? '<p class="note">Above 200 W, MPPT usually pays for itself: 20–30% more harvest in cold/cloudy conditions and it lets you run a higher-voltage array on thinner wire.</p>'
    : '<p class="note">MPPT harvests 20–30% more than PWM in cold or cloudy weather. PWM is fine for small ~100–200 W trickle arrays.</p>';
  var box = el("ccResult"); box.hidden = false;
  if (window.updateMatchedCTA) window.updateMatchedCTA(rec, 'controller');
  box.innerHTML = '<div class="big">'+rec+' A <span class="unit">'+type.toUpperCase()+' charge controller</span></div>'+
    '<div class="grid2">'+
      '<div class="stat"><b>'+fmt(watts)+'</b><span>Array watts</span></div>'+
      '<div class="stat"><b>'+amps.toFixed(1)+' A</b><span>Max charge current (calculated)</span></div>'+
      '<div class="stat"><b>'+v+' V</b><span>Bank voltage</span></div>'+
      '<div class="stat"><b>'+fmt(Math.min(watts, rec*v*0.85))+' W</b><span>Array this controller saturates at '+v+' V</span></div>'+
    '</div>'+
    mpptTip;
}

/* ---------- 4. Panels per battery ---------- */
function panelsForBattery(){
  var ah  = Math.max(1, parseFloat(el("pvAh").value) || 0);
  var v   = parseFloat(el("pvV").value) || 12;
  var sun = Math.max(1, parseFloat(el("pvSun").value) || 4.5);
  var panel = parseFloat(el("pvPanel").value) || 300;
  var wh = ah * v;
  var needW = wh / sun / 0.85;          // recharge one full cycle per day
  var count = Math.ceil(needW / panel);
  var daysAtOne = sun / (needW / panel); // days to full charge with a single panel
  var box = el("pvResult"); box.hidden = false;
  if (window.updateMatchedCTA) window.updateMatchedCTA(panel, 'panels');
  box.innerHTML = '<div class="big">'+count+'× <span class="unit">'+panel+' W panels</span></div>'+
    '<div class="grid2">'+
      '<div class="stat"><b>'+fmt(wh)+'</b><span>Wh stored in the battery</span></div>'+
      '<div class="stat"><b>'+fmt(needW)+'</b><span>Array watts for a one-day recharge</span></div>'+
      '<div class="stat"><b>'+daysAtOne.toFixed(1)+'</b><span>Days to full with a single '+panel+' W panel</span></div>'+
      '<div class="stat"><b>'+sun+'</b><span>Sun hrs/day assumed</span></div>'+
    '</div>'+
    '<p class="note">Assumes 85% charge efficiency (controller + battery round-trip). Charging to 100% every cycle is hard on lead-acid; LiFePO4 doesn\'t care. Sizing the bank itself, not the recharge? Use the <a href="https://battery-bank-sizer.com/" rel="noopener">battery bank sizer</a>.</p>';
}

/* ---------- init ---------- */
document.addEventListener("DOMContentLoaded", function(){
  el("presetSelect").innerHTML = presetOptions();
  renderLoads();
  // preselect a common starter set so the tool shows something useful immediately
  addLoad(PRESETS[0].name, PRESETS[0].w, PRESETS[0].hrs);
  addLoad(PRESETS[1].name, PRESETS[1].w, PRESETS[1].hrs);
  addLoad(PRESETS[2].name, PRESETS[2].w, PRESETS[2].hrs);
});
