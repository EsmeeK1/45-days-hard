// ============================================================
//  Inhoud van de app. Dit bestand mag je zelf aanpassen.
//  Na een aanpassing: app één keer openen met internet,
//  daarna nog een keer sluiten en openen om de nieuwe versie te zien.
// ============================================================

// Dagelijkse checklist. De id's niet veranderen (de app gebruikt ze),
// titel en info wel. 'kracht' staat alleen op gymdagen, 'fysio' alleen
// op rust- en hersteldagen en telt niet mee voor het voltooien van de dag.
const TAKEN = [
  { id: 'kracht',     titel: 'Krachttraining binnen', info: 'Max 45 min' },
  { id: 'buiten',     titel: 'Buitenworkout 45 min',  info: '' },
  { id: 'water',      titel: '2 liter water' },
  { id: 'voeding',    titel: 'Voedingsafspraken nageleefd', info: '' },
  { id: 'lezen',      titel: "10 pagina's lezen",     info: '' },
  { id: 'mediteren',  titel: '10 minuten mediteren',  info: 'Headspace' },
  { id: 'opstaan',    titel: 'Op tijd opgestaan',     info: '' },
  { id: 'schermvrij', titel: 'Schermvrij',            info: 'Eerste en laatste halfuur van de dag geen telefoon' },
  { id: 'fysio',      titel: 'Fysio-oefeningen knie', info: 'Optioneel, telt niet mee' },
];

// Hevy-routines voor de krachttraining. Naam en link mag je aanpassen.
// Naast deze routines kun je in het schema kiezen uit:
//   'Hersteldag': geen gym, geen vrije maaltijd
//   'Rustdag':    geen gym, wel één vrije maaltijd
const ROUTINES = [
  { naam: 'Upper body Pull', link: 'https://hevy.com/routine/pNIynymFe4A' },
  { naam: 'Upper body Push', link: 'https://hevy.com/routine/sJ6g5LZFk7S' },
  { naam: 'Lower C - VKB Fysio 🙃', link: 'https://hevy.com/routine/jwCF8i850uh' },
  { naam: 'Lower B - Hamstrings/ SL', link: 'https://hevy.com/routine/aqW5HfBlWIn' },
  { naam: 'Lower A - Quad/ Balans', link: 'https://hevy.com/routine/zafbGRlAw00' },
];

// Standaard weekschema, maandag t/m zondag.
// Let op: zodra je het schema in de app (Instellingen) aanpast,
// gebruikt de app dat schema en niet meer dit standaardschema.
const BUITEN = '45 min wandelen of fietsen';
const WEEKSCHEMA = [
  // Nooit twee beendagen achter elkaar; zwaarste beendag (Lower A) na de rustdag.
  { training: ROUTINES[4].naam, buiten: BUITEN }, // maandag:   Lower A - Quad/ Balans
  { training: ROUTINES[0].naam, buiten: BUITEN }, // dinsdag:   Upper body Pull
  { training: ROUTINES[3].naam, buiten: BUITEN }, // woensdag:  Lower B - Hamstrings/ SL
  { training: 'Hersteldag',     buiten: BUITEN }, // donderdag: herstel na 2 beendagen
  { training: ROUTINES[1].naam, buiten: BUITEN }, // vrijdag:   Upper body Push
  { training: ROUTINES[2].naam, buiten: BUITEN }, // zaterdag:  Lower C - VKB Fysio
  { training: 'Rustdag',        buiten: BUITEN }, // zondag
];

// Uitzonderingen voor specifieke datums. Gaan voor het weekschema.
// Alle velden zijn optioneel:
//   training: naam van een routine, 'Hersteldag' of 'Rustdag'
//   buiten:   tekst voor de buitenworkout
//   notitie:  wordt als melding getoond op die dag
const UITZONDERINGEN = {
  '2026-12-31': { training: 'Rustdag', notitie: 'Oudjaarsdag: vrije maaltijd en alcohol toegestaan.' },
  '2027-01-03': { training: 'Hersteldag' },
};

// Lichaamsmetingen op het Voortgang-scherm. De datums zijn in de app aan te passen.
const METINGEN = [
  { naam: 'Start',       datum: '2026-11-21' },
  { naam: 'Halverwege',  datum: '2026-12-19' },
  { naam: 'Eind',        datum: '2027-01-16' },
];

// Alleen als geheugensteun, geen calorie-tracker.
const VOEDINGSDOEL = 'Ongeveer 1800-1900 kcal en 115-130 g eiwit per dag';

// Recepten per sectie. Alle velden behalve 'naam' zijn optioneel:
//   naam:         'Naam van het recept'
//   porties:      '2 porties'
//   ingredienten: ['200 g kipfilet', '1 ui']
//   bereiding:    ['Stap 1', 'Stap 2']
//   houdbaarheid: '3 dagen in de koelkast'
//   mealprep:     true of false
//   notitie:      'Losse tip of opmerking'
const RECEPTEN = [
  {
    titel: 'Ontbijt',
    recepten: [
      {
        naam: 'Upfront oats',
        ingredienten: ['Upfront oats', '1 appel', 'Koffie'],
      },
      {
        naam: 'Skyr met appel',
        ingredienten: ['250 g skyr', '1 appel', '15 g Upfront muesli of 15 g Holy Moly chocolate'],
      },
      {
        naam: 'Eiermuffins',
        porties: '6 muffins',
        ingredienten: ['6 eieren', 'Paprika', 'Spinazie', 'Lente-ui', 'Beetje geraspte 30+ kaas'],
        bereiding: [
          'Verwarm de oven voor op 180 °C.',
          'Klop de eieren los en roer de paprika, spinazie, lente-ui en kaas erdoor.',
          'Verdeel over een muffinvorm.',
          '20 minuten bakken op 180 °C.',
        ],
        houdbaarheid: '4 dagen in de koelkast',
        mealprep: true,
        notitie: 'Eet 2-3 stuks met een sneetje roggebrood en een appel.',
      },
    ],
  },
  {
    titel: 'Lunch (kantoor)',
    recepten: [
      {
        naam: 'Kantoorlunch',
        ingredienten: ['2 plakken brood', '1-2 harde crackers', '2 gekookte eieren', '200 ml kefir'],
        notitie: 'Beleg bij voorkeur: kipfilet, cottage cheese sweet chili of 30+ kaas. Af en toe: Johma kip samba of salami.',
      },
    ],
  },
  {
    titel: 'Avondeten',
    recepten: [
      // Voorbeeld (haal de // weg en vul in):
      // {
      //   naam: 'Kip met groenten uit de oven',
      //   porties: '4 porties',
      //   ingredienten: ['600 g kipfilet', '2 paprika', '1 courgette'],
      //   bereiding: ['Oven op 200 °C.', 'Alles snijden en 25 min bakken.'],
      //   houdbaarheid: '3 dagen in de koelkast',
      //   mealprep: true,
      // },
    ],
  },
];
