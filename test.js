// Controle van de challenge-logica. Uitvoeren met: node test.js
const vm = require('vm');
const fs = require('fs');
const assert = require('assert');

const ctx = vm.createContext({ localStorage: { getItem: () => null, setItem() {}, removeItem() {} }, alert() {} });
for (const f of ['data.js', 'app.js']) vm.runInContext(fs.readFileSync(`${__dirname}/${f}`, 'utf8'), ctx);
const run = code => vm.runInContext(code, ctx);

const allChecks = '{ kracht: true, buiten: true, voeding: true, lezen: true, mediteren: true, opstaan: true, schermvrij: true }';
const fill = (from, to, rec = `{ checks: ${allChecks}, water: 8 }`) =>
  run(`for (let d = '${from}'; d <= '${to}'; d = addDays(d, 1)) state.days[d] = ${rec};`);
const reset = start => run(`state = { ...leeg(), startDate: '${start}' }`);
const calc = today => run(`calc('${today}')`);

// Geen enkele dag gedaan: alles voor gisteren telt als gemist.
reset('2026-11-01');
let c = calc('2026-11-10');
assert.strictEqual(c.missed, 8);
assert.strictEqual(c.done, 0);
assert.strictEqual(c.status['2026-11-09'], 'open');   // gisteren mag nog
assert.strictEqual(c.end, '2026-12-23');              // 1 nov + 44 + 8
assert.strictEqual(c.total, 53);

// Alles gedaan: geen verschuiving.
fill('2026-11-01', '2026-11-10');
c = calc('2026-11-10');
assert.deepStrictEqual([c.done, c.missed, c.longest, c.end], [10, 0, 10, '2026-12-15']);

// Water niet vol = dag niet voltooid, reeks breekt.
run(`state.days['2026-11-05'].water = 7`);
c = calc('2026-11-10');
assert.deepStrictEqual([c.done, c.missed, c.longest, c.end], [9, 1, 5, '2026-12-16']);

// Rustdag (zondag 8 nov): krachttraining is niet nodig.
reset('2026-11-01');
fill('2026-11-08', '2026-11-09', `{ checks: { buiten: true, voeding: true, lezen: true, mediteren: true, opstaan: true, schermvrij: true }, water: 8 }`);
c = calc('2026-11-10');
assert.strictEqual(c.status['2026-11-08'], 'done');
assert.strictEqual(c.status['2026-11-09'], 'open');   // maandag zonder kracht

// Schema later wijzigen verandert oude dagen niet (zondag 8 nov blijft rustdag).
run(`state.days[todayStr()] = { checks: {}, water: 0 }; save();`);
assert.strictEqual(run(`state.days[todayStr()].plan.training`), run(`schedulePlan(todayStr()).training`));
run(`state.days['2026-11-08'].plan = { training: 'Rustdag', buiten: 'x' }`);
run(`state.schedule = WEEKSCHEMA.map(p => ({ ...p })); state.schedule[6].training = 'Push'; state.schedule[2].training = 'Rustdag';`);
assert.strictEqual(calc('2026-11-10').status['2026-11-08'], 'done');

// 45 dagen gehaald: challenge klaar, einddatum = dag van de 45e voltooide dag.
reset('2026-09-01');
fill('2026-09-01', '2026-11-10');
c = calc('2026-11-10');
assert.deepStrictEqual([c.finished, c.done, c.end, c.total], [true, 45, '2026-10-15', 45]);

// 44 gedaan en gisteren nog open: einddatum ligt nooit vóór vandaag.
reset('2026-09-26');
fill('2026-09-26', '2026-11-08');
c = calc('2026-11-10');
assert.deepStrictEqual([c.done, c.finished, c.end], [44, false, '2026-11-10']);

// Startdatum in de toekomst.
reset('2026-12-01');
c = calc('2026-11-10');
assert.deepStrictEqual([c.done, c.missed, c.end], [0, 0, '2027-01-14']);

console.log('Alle tests geslaagd.');
