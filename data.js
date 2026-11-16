// ============================================================
//  Inhoud van de app. Dit bestand mag je zelf aanpassen.
//  Na een aanpassing: app één keer openen met internet,
//  daarna nog een keer sluiten en openen om de nieuwe versie te zien.
// ============================================================

// Dagelijkse checklist. De id's niet veranderen (de app gebruikt ze),
// titel en info wel.
const TAKEN = [
  { id: 'kracht',     titel: 'Krachttraining binnen', info: 'Max 45 min' },
  { id: 'buiten',     titel: 'Buitenworkout 45 min',  info: '' },
  { id: 'water',      titel: '2 liter water' },
  { id: 'voeding',    titel: 'Voedingsafspraken nageleefd', info: '' },
  { id: 'lezen',      titel: "10 pagina's lezen",     info: '' },
  { id: 'mediteren',  titel: '10 minuten mediteren',  info: 'Headspace' },
  { id: 'opstaan',    titel: 'Op tijd opgestaan',     info: '' },
  { id: 'schermvrij', titel: 'Schermvrij',            info: 'Eerste en laatste halfuur van de dag geen telefoon' },
];

// Keuzes voor krachttraining. 'Rustdag' betekent: geen krachttraining
// en één vrije maaltijd.
const TRAININGEN = ['Push', 'Pull', 'Lower', 'Rustdag'];

// Standaard weekschema, maandag t/m zondag.
// Let op: zodra je het schema in de app (Instellingen) aanpast,
// gebruikt de app dat schema en niet meer dit standaardschema.
const WEEKSCHEMA = [
  { training: 'Push',    buiten: 'Stevig wandelen' },      // maandag
  { training: 'Pull',    buiten: 'Wandelen of fietsen' },  // dinsdag
  { training: 'Lower',   buiten: 'Rustig wandelen' },      // woensdag
  { training: 'Push',    buiten: 'Stevig wandelen' },      // donderdag
  { training: 'Pull',    buiten: 'Wandelen of fietsen' },  // vrijdag
  { training: 'Lower',   buiten: 'Rustig wandelen' },      // zaterdag
  { training: 'Rustdag', buiten: 'Ontspannen wandeling' }, // zondag
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
