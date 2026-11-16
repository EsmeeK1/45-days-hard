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
      {
        naam: 'Teriyaki-kipbowl',
        porties: '4 porties',
        ingredienten: [
          '600 g kipdijfilet, in blokjes',
          '240 g rijst (ongekookt)',
          '500 g broccoli, in roosjes',
          '200 g edamame (diepvries, gepeld)',
          '4 el sojasaus (minder zout)',
          '1 el honing',
          '2 teentjes knoflook, geperst',
          '1 tl geraspte gember',
          '1 el maizena met 4 el water',
          '1 tl sesamolie',
        ],
        bereiding: [
          'Kook de rijst volgens de verpakking.',
          'Meng sojasaus, honing, knoflook, gember en het maizenamengsel tot een saus.',
          'Bak de kip in de sesamolie in 6-8 minuten gaar en goudbruin.',
          'Giet de saus erbij en laat 2 minuten indikken.',
          'Kook of stoom de broccoli en edamame 4-5 minuten.',
          'Verdeel rijst, kip en groente over 4 bakjes.',
        ],
        houdbaarheid: '3-4 dagen in de koelkast, 2 maanden in de vriezer',
        mealprep: true,
        notitie: 'Ca. 575 kcal en 40 g eiwit per portie.',
      },
      {
        naam: 'Kip-shoarmabakje',
        porties: '4 porties',
        ingredienten: [
          '600 g kipfilet, in reepjes',
          '2 el shoarmakruiden',
          '1 kg krieltjes, gehalveerd',
          '2 el olijfolie',
          '1 komkommer',
          '4 tomaten',
          '400 g magere yoghurt',
          '1 teentje knoflook, geperst',
          'Peper, zout en eventueel verse munt',
        ],
        bereiding: [
          'Verwarm de oven voor op 200 °C.',
          'Hussel de krieltjes met 1 el olie, peper en zout en rooster ze 30-35 minuten.',
          'Meng de kip met de shoarmakruiden en 1 el olie en rooster de laatste 15-20 minuten mee op een tweede bakplaat.',
          'Roer de yoghurt met knoflook, peper, zout en eventueel munt tot een saus.',
          'Verdeel kip en krieltjes over 4 bakjes. Snijd komkommer en tomaat pas op de dag zelf.',
        ],
        houdbaarheid: '3-4 dagen in de koelkast',
        mealprep: true,
        notitie: 'Ca. 450 kcal en 42 g eiwit per portie. Bewaar de saus in een apart bakje.',
      },
      {
        naam: 'Kip-kikkererwtencurry',
        porties: '4 porties',
        ingredienten: [
          '500 g kipfilet, in blokjes',
          '1 ui, gesnipperd',
          '2 teentjes knoflook, geperst',
          '2 el milde currypasta of kerriepoeder',
          '1 blik tomatenblokjes (400 g)',
          '1 blik kikkererwten, uitgelekt',
          '200 ml kokosmelk light',
          '200 g spinazie (vers of diepvries)',
          '240 g rijst (ongekookt)',
          '1 el olie',
        ],
        bereiding: [
          'Kook de rijst volgens de verpakking.',
          'Fruit ui en knoflook 3 minuten in de olie.',
          'Bak de kip mee tot hij rondom wit is en roer de currypasta erdoor.',
          'Voeg tomatenblokjes, kikkererwten en kokosmelk toe en laat 10 minuten zachtjes koken.',
          'Roer de spinazie erdoor tot hij geslonken is.',
          'Verdeel curry en rijst over 4 bakjes.',
        ],
        houdbaarheid: '4 dagen in de koelkast, 3 maanden in de vriezer',
        mealprep: true,
        notitie: 'Ca. 530 kcal en 38 g eiwit per portie.',
      },
      {
        naam: 'Chili con carne',
        porties: '4 porties',
        ingredienten: [
          '500 g mager rundergehakt',
          '1 ui, gesnipperd',
          '2 paprika\'s, in blokjes',
          '2 teentjes knoflook, geperst',
          '1 blik tomatenblokjes (400 g)',
          '2 el tomatenpuree',
          '1 blik kidneybonen, uitgelekt',
          '1 klein blikje mais, uitgelekt',
          '2 tl komijn, 2 tl paprikapoeder, ½ tl chilipoeder (naar smaak)',
          '240 g rijst (ongekookt)',
          '1 el olie',
        ],
        bereiding: [
          'Kook de rijst volgens de verpakking.',
          'Bak het gehakt rul in de olie en schep het even uit de pan.',
          'Fruit ui, paprika en knoflook 5 minuten en bak de kruiden en tomatenpuree 1 minuut mee.',
          'Voeg het gehakt, de tomatenblokjes, bonen en mais toe.',
          'Laat minstens 15 minuten zachtjes pruttelen, langer mag ook.',
          'Verdeel chili en rijst over 4 bakjes.',
        ],
        houdbaarheid: '4 dagen in de koelkast, 3 maanden in de vriezer',
        mealprep: true,
        notitie: 'Ca. 520 kcal en 35 g eiwit per portie. Lekker met een lepel magere kwark erop.',
      },
      {
        naam: 'Bolognese met linzen',
        porties: '4 porties',
        ingredienten: [
          '400 g mager rundergehakt',
          '150 g rode linzen (droog)',
          '1 ui, gesnipperd',
          '2 wortels, geraspt',
          '1 courgette, geraspt',
          '2 teentjes knoflook, geperst',
          '500 g passata',
          '2 el tomatenpuree',
          '2 tl Italiaanse kruiden',
          '280 g volkorenpasta',
          '1 el olie',
        ],
        bereiding: [
          'Bak het gehakt rul in de olie.',
          'Voeg ui, wortel, courgette en knoflook toe en bak 5 minuten mee.',
          'Roer tomatenpuree en kruiden erdoor.',
          'Voeg passata, linzen en 300 ml water toe en laat 20 minuten zachtjes koken tot de linzen zacht zijn. Voeg water toe als het te dik wordt.',
          'Kook de pasta, giet af en verdeel met de saus over 4 bakjes.',
        ],
        houdbaarheid: '4 dagen in de koelkast, saus 3 maanden in de vriezer',
        mealprep: true,
        notitie: 'Ca. 600 kcal en 39 g eiwit per portie. Vries je in, doe dat dan met alleen de saus en kook de pasta vers.',
      },
      {
        naam: 'Taco-bowl',
        porties: '4 porties',
        ingredienten: [
          '500 g mager rundergehakt',
          '2 tl paprikapoeder, 1 tl komijn, 1 tl knoflookpoeder, 1 tl oregano, snuf chilipoeder',
          '1 rode ui, gesnipperd',
          '1 paprika, in blokjes',
          '1 blik zwarte bonen, uitgelekt',
          '240 g rijst (ongekookt)',
          '250 g magere kwark',
          '1 limoen',
          'Vers erbij: sla en tomaat',
        ],
        bereiding: [
          'Kook de rijst volgens de verpakking.',
          'Bak het gehakt rul en bak ui, paprika en de kruiden 5 minuten mee.',
          'Roer de zwarte bonen erdoor en warm 3 minuten mee.',
          'Roer de kwark met limoensap, peper en zout tot een saus.',
          'Verdeel rijst en gehaktmengsel over 4 bakjes. Doe sla en tomaat er pas op de dag zelf bij.',
        ],
        houdbaarheid: '3-4 dagen in de koelkast',
        mealprep: true,
        notitie: 'Ca. 500 kcal en 40 g eiwit per portie. Bewaar de kwarksaus in een apart bakje.',
      },
      {
        naam: 'Shakshuka met kikkererwten',
        porties: '4 porties',
        ingredienten: [
          'Saus (voor 4 keer):',
          '1 ui, gesnipperd',
          '2 paprika\'s, in reepjes',
          '2 teentjes knoflook, geperst',
          '1 tl komijn en 1 tl gerookt paprikapoeder',
          '2 blikken tomatenblokjes (2x 400 g)',
          '1 blik kikkererwten, uitgelekt',
          '1 el olie',
          'Per portie vers erbij:',
          '3 eieren',
          '25 g feta',
          '1 sneetje volkorenbrood',
        ],
        bereiding: [
          'Saus: fruit ui, paprika en knoflook 5 minuten in de olie en bak de kruiden 1 minuut mee.',
          'Voeg tomatenblokjes en kikkererwten toe en laat 15 minuten indikken. Breng op smaak met peper en zout.',
          'Laat afkoelen en verdeel over 4 bakjes.',
          'Op de dag zelf: verwarm 1 portie saus in een kleine pan, maak 3 kuiltjes en breek daar de eieren in.',
          'Deksel erop en 5-7 minuten zachtjes garen. Verkruimel de feta erover en eet met het brood.',
        ],
        houdbaarheid: 'Saus 4 dagen in de koelkast, 3 maanden in de vriezer',
        mealprep: true,
        notitie: 'Ca. 540 kcal en 34 g eiwit per portie. Alleen de saus prep je; de eieren maak je vers in 10 minuten.',
      },
    ],
  },
];
