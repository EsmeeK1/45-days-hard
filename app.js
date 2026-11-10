'use strict';

const KEY = '45-dagen-challenge';
const DOEL = 45;
const GLAZEN = 8;
const DAGEN = ['maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag', 'zondag'];
const LANG = { weekday: 'long', day: 'numeric', month: 'long' };

// ---------- Datums: altijd 'YYYY-MM-DD' in lokale tijd ----------
const pad = n => String(n).padStart(2, '0');
const fmt = dt => `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`;
const parse = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const addDays = (s, n) => { const dt = parse(s); dt.setDate(dt.getDate() + n); return fmt(dt); };
const diffDays = (a, b) => Math.round((parse(b) - parse(a)) / 864e5);
const weekday = s => (parse(s).getDay() + 6) % 7; // 0 = maandag
const todayStr = () => fmt(new Date());
const nice = (s, opts = { day: 'numeric', month: 'short' }) => parse(s).toLocaleDateString('nl-NL', opts);
const isDate = s => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s);

// ---------- Opslag ----------
const leeg = () => ({ startDate: null, schedule: null, days: {}, weights: {}, lastBackup: null });

function load() {
  try { return { ...leeg(), ...JSON.parse(localStorage.getItem(KEY)) }; }
  catch { return leeg(); }
}

let state = load();

function save() {
  // Leg het schema vast voor de dagen die nog af te vinken zijn, zodat
  // een latere schemawijziging oude dagen niet achteraf verandert.
  const t = todayStr();
  for (const d of [t, addDays(t, -1)]) if (state.days[d]) state.days[d].plan = schedulePlan(d);
  try { localStorage.setItem(KEY, JSON.stringify(state)); }
  catch { alert('Opslaan is mislukt. Maak een back-up via Instellingen.'); }
}

// ---------- Challenge-logica ----------
const schedule = () => state.schedule || WEEKSCHEMA;
const schedulePlan = d => ({ ...schedule()[weekday(d)] });
const isRest = plan => plan.training === 'Rustdag';
const tasksFor = plan => TAKEN.filter(t => !(t.id === 'kracht' && isRest(plan)));
const taskDone = (rec, t) => t.id === 'water' ? rec.water >= GLAZEN : !!rec.checks?.[t.id];
const day = d => (state.days[d] ||= { checks: {}, water: 0, note: '' });

// Vandaag en gisteren volgen het huidige schema, oudere dagen hun vastgelegde schema.
function planFor(d, today = todayStr()) {
  const rec = state.days[d];
  return rec && rec.plan && d < addDays(today, -1) ? rec.plan : schedulePlan(d);
}

function isComplete(d, today = todayStr()) {
  const rec = state.days[d];
  return !!rec && tasksFor(planFor(d, today)).every(t => taskDone(rec, t));
}

function calc(today = todayStr()) {
  const start = state.startDate;
  const yesterday = addDays(today, -1);
  const status = {};
  let done = 0, missed = 0, run = 0, longest = 0, end = null;
  for (let d = start; d <= today && !end; d = addDays(d, 1)) {
    if (isComplete(d, today)) {
      done++; run++; longest = Math.max(longest, run);
      status[d] = 'done';
      if (done === DOEL) end = d;
    } else {
      run = 0;
      status[d] = d < yesterday ? 'missed' : 'open';
      if (d < yesterday) missed++;
    }
  }
  const finished = !!end;
  if (!end) {
    // Elke gemiste dag komt er achteraan bij.
    end = addDays(start, DOEL - 1 + missed);
    if (end < today) end = today;
  }
  return { start, today, done, missed, longest, end, finished, status, total: diffDays(start, end) + 1 };
}

// ---------- Weergave ----------
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => `&#${c.charCodeAt(0)};`);
const kg = v => String(v).replace('.', ',');
let view = 'vandaag';
let welkeDag = 0; // 0 = vandaag, -1 = gisteren
const huidigeDag = () => addDays(todayStr(), welkeDag);

function renderToday() {
  const el = $('#vandaag');
  if (!state.startDate) {
    el.innerHTML = `
      <h1>45 dagen challenge</h1>
      <div class="card">
        <p>Kies de dag waarop je begint. Daarna verschijnt hier elke dag je checklist.</p>
        <label class="field">Startdatum <input type="date" id="startInput" value="${todayStr()}"></label>
        <button class="btn primary" id="startBtn">Start de challenge</button>
      </div>`;
    return;
  }
  const c = calc();
  if (c.today < c.start) {
    const n = diffDays(c.today, c.start);
    el.innerHTML = `
      <h1>Bijna begonnen</h1>
      <div class="card center"><p class="big">${n}</p>
      <p>${n === 1 ? 'dag' : 'dagen'} tot de start op ${nice(c.start, LANG)}</p></div>`;
    return;
  }
  if (addDays(c.today, -1) < c.start) welkeDag = 0;
  const d = huidigeDag();
  const seg = addDays(c.today, -1) >= c.start ? `
    <div class="seg">
      <button data-dag="0" aria-pressed="${welkeDag === 0}">Vandaag</button>
      <button data-dag="-1" aria-pressed="${welkeDag === -1}">Gisteren</button>
    </div>` : '';
  const head = `
    <p class="eyebrow">${nice(d, LANG)}</p>
    <h1>Dag ${diffDays(c.start, d) + 1} <span>van ${c.total}</span></h1>`;
  const finished = c.finished ? `<div class="banner done">Challenge voltooid! ${DOEL} dagen gehaald op ${nice(c.end, LANG)}.</div>` : '';

  if (c.finished && d > c.end) { el.innerHTML = finished + seg; return; }

  const plan = schedulePlan(d);
  const rest = isRest(plan);
  const rec = state.days[d] || { checks: {}, water: 0, note: '' };
  const tasks = tasksFor(plan);
  const n = tasks.filter(t => taskDone(rec, t)).length;
  const info = t => ({ kracht: `${plan.training} · ${t.info}`, buiten: plan.buiten || t.info, voeding: VOEDINGSDOEL }[t.id] ?? t.info);

  el.innerHTML = `
    ${finished}${head}${seg}
    <div class="card plan${rest ? ' rest' : ''}">
      <span class="tag">${welkeDag ? 'Training gisteren' : 'Training vandaag'}</span>
      <h2>${rest ? 'Rustdag' : esc(plan.training)}</h2>
      <p>${esc(plan.buiten)}</p>
    </div>
    ${rest ? '<div class="banner rest">Rustdag: één vrije maaltijd. De overige regels blijven gelden.</div>' : ''}
    ${n === tasks.length ? '<div class="banner done">Dag voltooid. Goed bezig!</div>' : ''}
    <div class="progress-label"><span>${n} van ${tasks.length} gedaan</span></div>
    <div class="progress"><i style="width:${(n / tasks.length) * 100}%"></i></div>
    <div class="tasks">
      ${tasks.map(t => t.id === 'water' ? `
        <div class="task water">
          <div class="task-top">
            <span class="box${taskDone(rec, t) ? ' on' : ''}" aria-hidden="true"></span>
            <span class="txt"><b>${esc(t.titel)}</b><small>${rec.water} van ${GLAZEN} glazen · ${rec.water * 250} ml</small></span>
          </div>
          <div class="glasses">${Array.from({ length: GLAZEN }, (_, i) => `
            <button class="glass${i < rec.water ? ' full' : ''}" data-glass="${i + 1}" aria-label="Glas ${i + 1}" aria-pressed="${i < rec.water}"></button>`).join('')}
          </div>
        </div>` : `
        <label class="task">
          <input type="checkbox" data-task="${t.id}"${taskDone(rec, t) ? ' checked' : ''}>
          <span class="box" aria-hidden="true"></span>
          <span class="txt"><b>${esc(t.titel)}</b>${info(t) ? `<small>${esc(info(t))}</small>` : ''}</span>
        </label>`).join('')}
    </div>
    <label class="field">Notitie <textarea id="note" rows="3" placeholder="Hoe ging het?"></textarea></label>`;
  $('#note').value = rec.note || '';
}

function renderProgress() {
  const el = $('#voortgang');
  if (!state.startDate) { el.innerHTML = '<h1>Voortgang</h1><p class="muted">Stel eerst een startdatum in.</p>'; return; }
  const c = calc();
  const cells = DAGEN.map(n => `<span class="wd">${n.slice(0, 2)}</span>`);
  for (let i = 0; i < weekday(c.start); i++) cells.push('<span></span>');
  for (let d = c.start, n = 1; d <= c.end; d = addDays(d, 1), n++) {
    const cls = [c.status[d] || 'future', isRest(planFor(d, c.today)) && 'rest', d === c.today && 'today'].filter(Boolean).join(' ');
    cells.push(`<span class="cell ${cls}" title="${nice(d, LANG)}">${n}</span>`);
  }
  const weeks = Math.ceil(c.total / 7);
  el.innerHTML = `
    <h1>Voortgang</h1>
    <div class="stats">
      <div><b>${c.done}</b><span>voltooid</span></div>
      <div><b>${DOEL - c.done}</b><span>nog te gaan</span></div>
      <div><b>${c.missed}</b><span>gemist</span></div>
    </div>
    <div class="card row"><span>${c.finished ? 'Voltooid op' : 'Huidige einddatum'}</span><b>${nice(c.end, LANG)}</b></div>
    <div class="card row"><span>Langste reeks</span><b>${c.longest} ${c.longest === 1 ? 'dag' : 'dagen'}</b></div>
    <div class="card">
      <div class="grid">${cells.join('')}</div>
      <div class="legend">
        <span><i class="done"></i>Voltooid</span><span><i class="restdone"></i>Rustdag</span>
        <span><i class="missed"></i>Gemist</span><span><i class="open"></i>Nog open</span><span><i class="future"></i>Toekomst</span>
      </div>
    </div>
    <h2 class="section">Gewicht per week (optioneel)</h2>
    <div class="card">
      ${chart(weeks)}
      ${Array.from({ length: weeks }, (_, i) => `
        <label class="wrow"><span>Week ${i + 1} <small>${nice(addDays(c.start, i * 7))}</small></span>
          <input type="text" inputmode="decimal" data-week="${i + 1}" value="${state.weights[i + 1] != null ? kg(state.weights[i + 1]) : ''}" placeholder="kg"></label>`).join('')}
    </div>`;
}

function chart(weeks) {
  const pts = Object.entries(state.weights).map(([w, v]) => [Number(w), v]).filter(([w]) => w <= weeks).sort((a, b) => a[0] - b[0]);
  if (pts.length < 2) return '<p class="muted small">Vul minstens 2 weken in voor een grafiekje.</p>';
  const W = 320, H = 150, P = 26;
  const vs = pts.map(p => p[1]);
  let lo = Math.min(...vs), hi = Math.max(...vs);
  if (hi - lo < 1) { lo -= 0.5; hi += 0.5; }
  const x = w => (P + ((w - 1) / Math.max(weeks - 1, 1)) * (W - 2 * P)).toFixed(1);
  const y = v => (P + ((hi - v) / (hi - lo)) * (H - 2 * P - 10)).toFixed(1);
  return `
    <svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Gewicht per week">
      <polyline points="${pts.map(([w, v]) => `${x(w)},${y(v)}`).join(' ')}"/>
      ${pts.map(([w, v]) => `<circle cx="${x(w)}" cy="${y(v)}" r="4"/><text x="${x(w)}" y="${y(v) - 10}">${kg(v)}</text><text class="ax" x="${x(w)}" y="${H - 4}">W${w}</text>`).join('')}
    </svg>`;
}

function recipe(r) {
  const meta = [
    r.porties && (typeof r.porties === 'number' ? `${r.porties} ${r.porties === 1 ? 'portie' : 'porties'}` : r.porties),
    r.houdbaarheid && `Houdbaar: ${r.houdbaarheid}`,
  ].filter(Boolean);
  return `
    <details class="card recipe">
      <summary><span>${esc(r.naam)}</span>${r.mealprep ? '<span class="pill">Mealprep</span>' : ''}</summary>
      ${meta.length ? `<p class="muted small">${meta.map(esc).join(' · ')}</p>` : ''}
      ${r.ingredienten?.length ? `<h3>Ingrediënten</h3><ul>${r.ingredienten.map(i => `<li>${esc(i)}</li>`).join('')}</ul>` : ''}
      ${r.bereiding?.length ? `<h3>Bereiding</h3><ol>${r.bereiding.map(s => `<li>${esc(s)}</li>`).join('')}</ol>` : ''}
      ${r.notitie ? `<p>${esc(r.notitie)}</p>` : ''}
    </details>`;
}

function renderRecipes() {
  $('#recepten').innerHTML = `
    <h1>Recepten</h1>
    <div class="banner">Doel: ${esc(VOEDINGSDOEL)}</div>
    ${RECEPTEN.map(s => `
      <h2 class="section">${esc(s.titel)}</h2>
      ${s.recepten.length ? s.recepten.map(recipe).join('') : '<p class="muted">Nog geen recepten. Voeg ze toe in data.js.</p>'}`).join('')}`;
}

function renderSettings() {
  const s = schedule();
  $('#instellingen').innerHTML = `
    <h1>Instellingen</h1>
    <div class="card">
      <label class="field">Startdatum <input type="date" id="setStart" value="${state.startDate || ''}"></label>
    </div>
    <h2 class="section">Weekschema</h2>
    <div class="card">
      <p class="muted small">Kies per dag de krachttraining en de buitenworkout. Kies 'Rustdag' voor je rustdag.</p>
      ${DAGEN.map((n, i) => `
        <div class="srow">
          <span class="dname">${n}</span>
          <select data-sched="${i}" aria-label="Training op ${n}">
            ${TRAININGEN.map(t => `<option${t === s[i].training ? ' selected' : ''}>${esc(t)}</option>`).join('')}
          </select>
          <input type="text" data-buiten="${i}" value="${esc(s[i].buiten)}" aria-label="Buitenworkout op ${n}">
        </div>`).join('')}
    </div>
    <h2 class="section">Back-up</h2>
    <div class="card">
      <p class="muted small">Laatste back-up: ${state.lastBackup ? nice(state.lastBackup, LANG) : 'nog nooit'}.
      iOS kan opgeslagen data wissen, dus exporteer regelmatig.</p>
      <button class="btn primary" id="exportBtn">Exporteer data</button>
      <label class="btn">Importeer back-up<input type="file" id="importInput" class="vh" accept=".json,application/json"></label>
    </div>
    <h2 class="section">Opnieuw beginnen</h2>
    <div class="card">
      <button class="btn danger" id="resetBtn">Alles resetten</button>
    </div>`;
}

const RENDER = { vandaag: renderToday, voortgang: renderProgress, recepten: renderRecipes, instellingen: renderSettings };
const render = () => RENDER[view]();

function show(v) {
  view = v;
  document.querySelectorAll('.view').forEach(s => { s.hidden = s.id !== v; });
  document.querySelectorAll('.tabs button').forEach(b => {
    if (b.dataset.view === v) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
  });
  render();
  scrollTo(0, 0);
}

// ---------- Back-up ----------
async function exportData() {
  const name = `45-dagen-backup-${todayStr()}.json`;
  const file = new File([JSON.stringify({ ...state, lastBackup: todayStr() }, null, 2)], name, { type: 'application/json' });
  if (navigator.canShare?.({ files: [file] })) {
    try { await navigator.share({ files: [file], title: name }); }
    catch (e) { if (e.name !== 'AbortError') alert('Delen mislukt: ' + e.message); return; }
  } else {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(file);
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
  state.lastBackup = todayStr();
  save();
  render();
}

async function importData(file) {
  let data;
  try { data = JSON.parse(await file.text()); } catch { data = null; }
  const ok = data && typeof data === 'object' && data.days && typeof data.days === 'object'
    && (data.startDate == null || isDate(data.startDate))
    && (data.schedule == null || (Array.isArray(data.schedule) && data.schedule.length === 7));
  if (!ok) { alert('Dit is geen geldig back-upbestand.'); return; }
  if (!confirm('Je huidige data wordt vervangen door de back-up. Doorgaan?')) return;
  state = { ...leeg(), ...data };
  save();
  alert('Back-up teruggezet.');
  show('vandaag');
}

// ---------- Events ----------
function init() {
  $('.tabs').addEventListener('click', e => {
    const b = e.target.closest('button');
    if (b) show(b.dataset.view);
  });

  const vandaag = $('#vandaag');
  vandaag.addEventListener('click', e => {
    const t = e.target;
    if (t.id === 'startBtn') { state.startDate = $('#startInput').value || todayStr(); save(); render(); }
    if (t.dataset.dag) { welkeDag = Number(t.dataset.dag); render(); }
    if (t.dataset.glass) {
      const rec = day(huidigeDag()), n = Number(t.dataset.glass);
      rec.water = rec.water === n ? n - 1 : n;
      save(); render();
      $(`[data-glass="${n}"]`)?.focus();
    }
  });
  vandaag.addEventListener('change', e => {
    const id = e.target.dataset.task;
    if (!id) return;
    day(huidigeDag()).checks[id] = e.target.checked;
    save(); render();
    $(`[data-task="${id}"]`)?.focus();
  });
  vandaag.addEventListener('input', e => {
    if (e.target.id === 'note') { day(huidigeDag()).note = e.target.value; save(); }
  });

  $('#voortgang').addEventListener('change', e => {
    const w = e.target.dataset.week;
    if (!w) return;
    const v = parseFloat(e.target.value.replace(',', '.'));
    if (v > 0 && v < 500) state.weights[w] = Math.round(v * 10) / 10; else delete state.weights[w];
    save(); render();
  });

  const inst = $('#instellingen');
  inst.addEventListener('change', e => {
    const t = e.target;
    if (t.id === 'setStart' && isDate(t.value)) { state.startDate = t.value; save(); }
    if (t.dataset.sched || t.dataset.buiten) {
      state.schedule = schedule().map(p => ({ ...p }));
      if (t.dataset.sched) state.schedule[t.dataset.sched].training = t.value;
      else state.schedule[t.dataset.buiten].buiten = t.value.trim();
      save();
    }
    if (t.id === 'importInput' && t.files[0]) { importData(t.files[0]); t.value = ''; }
  });
  inst.addEventListener('click', e => {
    if (e.target.id === 'exportBtn') exportData();
    if (e.target.id === 'resetBtn' && confirm('Weet je het zeker? Al je voortgang, notities en gewichten worden gewist. Tip: exporteer eerst een back-up.')) {
      state = leeg();
      localStorage.removeItem(KEY);
      show('vandaag');
    }
  });

  // Nieuwe dag als de app open bleef staan of uit de achtergrond terugkomt.
  document.addEventListener('visibilitychange', () => { if (!document.hidden && document.activeElement?.id !== 'note') render(); });

  show('vandaag');
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('service-worker.js');
  navigator.storage?.persist?.();
}

if (typeof document !== 'undefined') init();
