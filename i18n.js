// ================= I18N =================
// Supported UI languages. Item/category names are official in-game terms,
// researched and verified against Frontier's own localization where possible
// (see README for sources). English is the fallback for any missing key.

const SUPPORTED_LANGS = ["en", "fr", "de", "es", "ru"];
const LANG_NAMES = { en: "English", fr: "Français", de: "Deutsch", es: "Español", ru: "Русский" };

const ITEM_TRANSLATIONS = {
  en: { Totem: "Totem", Urn: "Urn", Casket: "Casket", Orb: "Orb", Relic: "Relic", Tablet: "Tablet" },
  fr: { Totem: "Totem", Urn: "Urne", Casket: "Coffret", Orb: "Orbe", Relic: "Relique", Tablet: "Tablette" },
  de: { Totem: "Totem", Urn: "Urne", Casket: "Schatulle", Orb: "Kugel", Relic: "Relikt", Tablet: "Tafel" },
  es: { Totem: "Tótem", Urn: "Urna", Casket: "Cofre", Orb: "Orbe", Relic: "Reliquia", Tablet: "Tablilla" },
  ru: { Totem: "Тотем", Urn: "Урна", Casket: "Шкатулка", Orb: "Сфера", Relic: "Реликвия", Tablet: "Табличка" },
};

const CATEGORY_TRANSLATIONS = {
  en: { History: "History", Language: "Language", Biology: "Biology", Culture: "Culture", Technology: "Technology" },
  fr: { History: "Histoire", Language: "Langue", Biology: "Biologie", Culture: "Culture", Technology: "Technologie" },
  de: { History: "Geschichte", Language: "Sprache", Biology: "Biologie", Culture: "Kultur", Technology: "Technologie" },
  es: { History: "Historia", Language: "Idioma", Biology: "Biología", Culture: "Cultura", Technology: "Tecnología" },
  ru: { History: "История", Language: "Язык", Biology: "Биология", Culture: "Культура", Technology: "Технология" },
};

const STRINGS = {
  en: {
    welcomeTagline: "Start or resume (thanks to import/export) your journey towards Ram Tah's 101 obelisks",
    mapDependencyNote: "Map provided by <strong>Canonn</strong> (external community site, independent from Obelisk Compass). If it doesn't display correctly, the rest of the tool (route, progress, resuming the mission) keeps working normally.",
    tutorialHtml: `<h3><span class="step-num">1</span> Choose your starting point</h3>
<p>Enter your <strong>current system</strong> and your <strong>ship's jump range</strong> (in light-years) in the "Optimised route" block. This information is only used to compute the best itinerary — nothing is sent anywhere.</p>

<h3><span class="step-num">2</span> Calculate the route</h3>
<p>Click <strong>Calculate route</strong>. The app picks and orders the systems to visit to cover all 101 data entries as efficiently as possible — a real optimisation engine, not just an estimate.</p>
<div class="tip">💡 Right after the page loads, a short sync with Canonn may happen (two spinning gears + "Syncing the galaxy..."). You can wait (usually a few seconds) or click <strong>Compute on partial data</strong> to skip the wait.</div>

<h3><span class="step-num">3</span> Move through the route</h3>
<p>Each row in the list is a system to visit:</p>
<ul>
<li>Clicking the <strong>middle</strong> of a row displays that system (map + obelisks) without recalculating anything.</li>
<li>Clicking the small <strong>▶</strong> on the right makes it your new starting point and recalculates the route from there — handy once you've arrived somewhere in-game.</li>
</ul>
<div class="tip">💡 If systems before the one you're targeting with ▶ aren't finished yet, a confirmation appears to warn you — nothing is lost, they'll simply reappear reorganised in the new list.</div>

<h3><span class="step-num">4</span> Once you're there in-game</h3>
<p>Use the <strong>📋 Copy</strong> button next to the system name (right column) to paste its name directly into the game's galaxy map — no need to retype it.</p>
<p>A planet can have <strong>several sites</strong> (Alpha/Beta/Gamma). The site currently shown on the map has an <strong>orange outline</strong> and is the only one with active checkboxes; the others are greyed out to prevent mistakes. Click <strong>Open (GRxx)</strong> to switch to another site on the same planet.</p>

<h3><span class="step-num">5</span> Scan and check off the obelisks</h3>
<p>For each obelisk listed, use the indicated items (Totem, Urn, Orb...) on the right obelisk in-game, then check the corresponding box.</p>
<div class="tip">💡 Some combinations exist on several different sites. Checking one automatically removes it from every other site where it appeared — never redo a duplicate.</div>

<h3><span class="step-num">6</span> Next site, then next system</h3>
<p>Once a site is done (0 useful obelisks left), move to another sub-site of the same planet via <strong>Open</strong>, or click the <strong>▶</strong> of the next row in the route to continue to the next system.</p>

<h3>🛟 Obelisk missed by Canonn?</h3>
<p>At the bottom of the right column, a small form lets you manually add a data entry obtained in-game that the app didn't show as available (category + codex number required, obelisk and items optional, just for your own reference).</p>

<h3>💾 Save or resume your progress</h3>
<p><strong>Export</strong> shows your progress as a compact list (e.g. <code>H01 L12 T09...</code>) to copy and keep somewhere safe. <strong>Import / Recalculate</strong> lets you paste a trusted list (rebuilt from your mission mails, for instance) to fully replace your progress — useful if you start using the app after already being well into the mission.</p>

<h3>↩️ Undo and reset</h3>
<p><strong>Undo</strong> only removes the very last checked item. In the right column, a <strong>Reset this system</strong> button appears when needed to only uncheck data obtained on the displayed planet, without touching anything else. <strong>Reset progress</strong> resets everything (with confirmation).</p>

<h3>🌐 Language and categories</h3>
<p>The selector at the top right changes the interface language at any time (auto-detected on first load). The small arrow next to the progress counter collapses or expands the category breakdown (History, Language, Biology, Culture, Technology).</p>

`,
    tutorialTitle: "How to use Obelisk Compass",
    tutorialBtnTitle: "Tutorial",
    galaxySyncLabel: "Syncing the galaxy...",
    skipSyncBtn: "Compute on partial data",
    waitingForSync: "Syncing...",
    categoryToggleLabel: "Details and actions",
    startSystemLabel: "Starting system",
    jumpRangeLabel: "Your ship's jump range (light-years)",
    routeOptimizerPitch: "A real optimisation engine: eliminates redundant sites and computes the exact best visiting order — not just an approximate itinerary.",
    discoverySyncing: "Checking Canonn for new sites...",
    discoveryDone: "{n} new site(s) integrated",
    retargetBtnTitle: "Recalculate the route starting from this system",
    copiedBtnLabel: "✓ Copied",
    appSubtitle: "(Ram Tah's Guardian Express 🚂)",
    progression: "Progress",
    dataCount: "{n} / {total} data",
    routeOptimisee: "Optimised route",
    startSystemPlaceholder: "Current system (e.g. Synuefe XR-H D11-102, Inki's starting point)",
    jumpRangePlaceholder: "Jump range (ly)",
    calculateRoute: "Calculate route",
    routeSearchingEdsm: "Looking up the system on EDSM...",
    routeSystemNotFound: "System \"{name}\" not found on EDSM — calculating without a start point (the first site will be chosen by value alone).",
    routeEdsmError: "Could not reach EDSM (check your internet connection). Calculating without a start point.",
    routeNoStartSystem: "No starting system given — calculating without a start point.",
    routeConfirmUnfinished: "Warning: {n} system(s) before this one aren't finished yet ({list}).\n\nRecalculating the route from \"{system}\" doesn't make them disappear (nothing is lost), it just reorders the visit order.\n\nContinue?",
    routeSystemWord_one: "system",
    routeSystemWord_other: "systems",
    routeSummary: "{n} {system} ({subSites} sites) · {dist} ly total · ~{jumps} jump(s) estimated",
    routeUncovered: "Warning: {n} data entrie(s) don't seem covered by any known site in your file.",
    routeCodexCovered: "+{n} codex",
    routeDistJumps: "{dist} ly (~{jumps} jump{s}) · total {cum} ly",
    exportBtn: "Export",
    importBtn: "Import / Recalculate",
    exportHint: "Your current progress ({n} entries), format H01 L12 T09... :",
    copyBtn: "Copy",
    copiedOk: "Copied to clipboard ✓",
    copyFailed: "Automatic copy failed — text selected, Ctrl+C manually.",
    importHintHtml: "Paste a trusted list here (mails, etc.): H01 L12 T09 B05... This <strong>completely replaces</strong> your current progress.",
    importTextareaPlaceholder: "H01 L12 T09 B05 C14 ...",
    importApplyBtn: "Replace my progress with this list",
    importNoList: "Paste a list first.",
    importNoValidEntries: "No valid entries recognised in the pasted text.",
    importConfirm: "Replace ALL your current progress ({n} entries) with this list of {m} valid entries{extra}? This action is irreversible.",
    importConfirmExtra: " ({n} token(s) ignored: {list})",
    importResult: "Progress replaced: {n} entries applied{extra}.",
    importResultExtra: ", {n} ignored",
    undoBtnTitle: "Undo the last checked item",
    undoBtnText: "Undo ({n})",
    resetBtnTitle: "Reset all progress",
    resetBtnText: "Reset progress",
    resetConfirm: "Reset all progress (101 data entries)? This action is irreversible.",
    detailEmpty: "Select a system on the left to see the obelisks worth scanning.",
    copySystemBtnTitle: "Copy the system name (for the game's galaxy map)",
    copySystemBtn: "📋 Copy",
    planetLabel: "Planet: {body}",
    resetSystemBtn_one: "Reset this system ({n} data unchecked)",
    resetSystemBtn_other: "Reset this system ({n} data unchecked)",
    resetSystemConfirm: "Uncheck the {n} data obtained on {system}? The rest of your progress on other systems is untouched.",
    manualAddTitle: "Obelisk missed by Canonn?",
    manualCodexPlaceholder: "#codex",
    manualObeliskPlaceholder: "Obelisk (e.g. C5, optional)",
    manualItemsPlaceholder: "Items (e.g. Totem + Urn, optional)",
    manualAddBtn: "Add",
    manualInvalidCodex: "Enter a valid codex number.",
    manualCodexTooHigh: "{cat} only goes up to #{max}.",
    manualAlreadyDone: "Already counted, noted anyway.",
    manualAdded: "Added to progress ✓",
    modalCancelBtn: "Cancel",
    modalConfirmBtn: "Confirm",
    celebrateTitle: "101 / 101",
    celebrateText: "Ram Tah mission complete — every fragment of the Guardian Codex has been recovered.",
    celebrateMeeneBefore: "Don't forget to bring your results back to Ram Tah at",
    celebrateMeeneAfter: ";)",
    celebrateCopyMeeneBtn: "📋 Meene",
    celebrateCloseBtn: "Close",
    dataLoadError: "Error loading data.json: {msg} — check the file is next to index.html and restart the server.",
    promptCopySystem: "Copy the system name:",
    coordLive: "✓ obelisks up to date (live)",
    coordLiveTitle: "Obelisk combinations fetched live from Canonn. Surface coordinates are deliberately not shown any more: even 'live' they turned out unreliable in-game (Frontier seems to change them occasionally). Trust the map and the letters/numbers shown on it instead.",
    coordOffline: "⚠ offline (fallback data)",
    coordOfflineTitle: "Couldn't reach Canonn (offline or blocked) — this data comes from the bundled backup and may be outdated.",
    coordSyncing: "⏳ syncing...",
    coordSyncingTitle: "Syncing with Canonn...",
    activeBadge: "● map shown",
    openCanonnBtn: "Open (GR{id})",
    utileCount_one: "{n} useful",
    utileCount_other: "{n} useful",
    noObelisksLeft: "No useful obelisk left on this site — already covered elsewhere or done.",
  },
  fr: {
    welcomeTagline: "Entamez ou reprenez (grâce à l'import/export) le voyage vers les 101 obélisques de Ram Tah",
    mapDependencyNote: "Carte fournie par <strong>Canonn</strong> (site communautaire externe, indépendant d'Obelisk Compass). Si elle ne s'affiche pas correctement, le reste de l'outil (route, progression, reprise de mission) continue de fonctionner normalement.",
    tutorialHtml: `<h3><span class="step-num">1</span> Choisis ton point de départ</h3>
<p>Renseigne ton <strong>système actuel</strong> et la <strong>portée de saut de ton vaisseau</strong> (en années-lumière) dans le bloc "Route optimisée". Ces deux infos servent uniquement à calculer le meilleur itinéraire — rien n'est envoyé nulle part.</p>

<h3><span class="step-num">2</span> Calcule la route</h3>
<p>Clique sur <strong>Calculer la route</strong>. L'appli choisit et ordonne les systèmes à visiter pour couvrir les 101 données le plus efficacement possible — un vrai moteur d'optimisation, pas juste une estimation.</p>
<div class="tip">💡 Juste après le chargement de la page, une courte synchronisation avec Canonn peut avoir lieu (deux roues crantées + "Synchronisation de la galaxie..."). Tu peux attendre (quelques secondes en général) ou cliquer sur <strong>Calculer sur données partielles</strong> pour ne pas patienter.</div>

<h3><span class="step-num">3</span> Avance dans la route</h3>
<p>Chaque ligne de la liste correspond à un système à visiter :</p>
<ul>
<li>Cliquer <strong>au centre</strong> d'une ligne affiche ce système (carte + obélisques) sans rien recalculer.</li>
<li>Cliquer sur le petit <strong>▶</strong> à droite en fait ton nouveau point de départ et recalcule la route à partir de là — pratique une fois arrivé quelque part en jeu.</li>
</ul>
<div class="tip">💡 Si des systèmes avant celui que tu cibles avec ▶ ne sont pas encore terminés, une confirmation s'affiche pour te prévenir — rien n'est perdu, ils réapparaîtront juste réorganisés dans la nouvelle liste.</div>

<h3><span class="step-num">4</span> Une fois sur place en jeu</h3>
<p>Utilise le bouton <strong>📋 Copier</strong> à côté du nom du système (colonne de droite) pour coller directement son nom dans la carte galactique du jeu — plus besoin de le retaper à la main.</p>
<p>Une planète peut avoir <strong>plusieurs sites</strong> (Alpha/Beta/Gamma). Le site actuellement affiché sur la carte a un <strong>contour orange</strong> et c'est le seul dont les cases à cocher sont actives ; les autres sont grisés pour éviter les erreurs. Clique sur <strong>Ouvrir (GRxx)</strong> pour changer de site sur la même planète.</p>

<h3><span class="step-num">5</span> Scanne et coche les obélisques</h3>
<p>Pour chaque obélisque listé, utilise les objets indiqués (Totem, Urne, Orbe...) sur le bon obélisque en jeu, puis coche la case correspondante.</p>
<div class="tip">💡 Certaines combinaisons existent sur plusieurs sites différents. Cocher une case la fait disparaître automatiquement de tous les autres sites où elle apparaissait — jamais de doublon à refaire.</div>

<h3><span class="step-num">6</span> Site suivant, puis système suivant</h3>
<p>Une fois un site terminé (0 obélisque utile restant), passe à un autre sous-site de la même planète via <strong>Ouvrir</strong>, ou reclique sur le <strong>▶</strong> de la ligne suivante dans la route pour continuer vers le prochain système.</p>

<h3>🛟 Obélisque manqué par Canonn ?</h3>
<p>En bas de la colonne de droite, un petit formulaire permet d'ajouter à la main une donnée obtenue en jeu mais que l'appli n'affichait pas comme disponible (catégorie + numéro de codex obligatoires, obélisque et objets facultatifs, juste pour ta mémoire).</p>

<h3>💾 Sauvegarder ou reprendre ta progression</h3>
<p><strong>Exporter</strong> affiche ta progression sous forme de liste compacte (ex: <code>H01 L12 T09...</code>) à copier et garder de côté. <strong>Importer / Recalculer</strong> permet de coller une liste sûre (reconstituée depuis tes mails de mission par exemple) pour remplacer entièrement ta progression — utile si tu commences à utiliser l'appli après avoir déjà bien avancé dans la mission.</p>

<h3>↩️ Annuler et réinitialiser</h3>
<p><strong>Annuler</strong> retire uniquement la toute dernière case cochée. Dans la colonne de droite, un bouton <strong>Réinitialiser ce système</strong> apparaît si besoin pour ne décocher que les données obtenues sur la planète affichée, sans toucher au reste. <strong>Réinitialiser la progression</strong> remet tout à zéro (avec confirmation).</p>

<h3>🌐 Langue et catégories</h3>
<p>Le sélecteur en haut à droite change la langue de l'interface à tout moment (détectée automatiquement au premier chargement). La petite flèche à côté du compteur de progression replie ou déplie le détail par catégorie (Histoire, Langue, Biologie, Culture, Technologie).</p>

`,
    tutorialTitle: "Comment utiliser Obelisk Compass",
    tutorialBtnTitle: "Tutoriel",
    galaxySyncLabel: "Synchronisation de la galaxie...",
    skipSyncBtn: "Calculer sur données partielles",
    waitingForSync: "Synchronisation...",
    categoryToggleLabel: "Détail et actions",
    startSystemLabel: "Système de départ",
    jumpRangeLabel: "Portée de saut de ton vaisseau (années-lumière)",
    routeOptimizerPitch: "Un vrai moteur d'optimisation : élimine les sites redondants et calcule l'ordre de visite exactement optimal — pas juste un itinéraire approximatif.",
    discoverySyncing: "Intégration des systèmes existants...",
    discoveryDone: "{n} nouveau(x) site(s) intégré(s)",
    retargetBtnTitle: "Recalculer la route en partant de ce système",
    copiedBtnLabel: "✓ Copié",
    appSubtitle: "(Le Guardian Express de Ram Tah 🚂)",
    progression: "Progression",
    dataCount: "{n} / {total} données",
    routeOptimisee: "Route optimisée",
    startSystemPlaceholder: "Système actuel (ex: Synuefe XR-H D11-102, le point de départ d'Inki)",
    jumpRangePlaceholder: "Rayon de saut (al)",
    calculateRoute: "Calculer la route",
    routeSearchingEdsm: "Recherche du système sur EDSM...",
    routeSystemNotFound: "Système \"{name}\" introuvable sur EDSM — calcul sans point de départ (le premier site sera choisi par valeur seule).",
    routeEdsmError: "Erreur de connexion à EDSM (vérifie ta connexion internet). Calcul sans point de départ.",
    routeNoStartSystem: "Aucun système de départ indiqué — calcul sans point de départ.",
    routeConfirmUnfinished: "Attention : {n} système(s) avant celui-ci ne sont pas encore terminés ({list}).\n\nRecalculer la route à partir de \"{system}\" ne les fait pas disparaître (rien n'est perdu), mais réorganise l'ordre de visite en fonction de cette nouvelle position.\n\nContinuer ?",
    routeSystemWord_one: "système",
    routeSystemWord_other: "systèmes",
    routeSummary: "{n} {system} ({subSites} sites) · {dist} al au total · ~{jumps} sauts estimés",
    routeUncovered: "Attention : {n} donnée(s) ne semblent couvertes par aucun site connu de ton fichier.",
    routeCodexCovered: "+{n} codex",
    routeDistJumps: "{dist} al (~{jumps} saut{s}) · cumul {cum} al",
    exportBtn: "Exporter",
    importBtn: "Importer / Recalculer",
    exportHint: "Ta progression actuelle ({n} entrées), format H01 L12 T09... :",
    copyBtn: "Copier",
    copiedOk: "Copié dans le presse-papier ✓",
    copyFailed: "Copie automatique impossible — texte sélectionné, Ctrl+C manuellement.",
    importHintHtml: "Colle ici une liste sûre (mails, etc.) : H01 L12 T09 B05... Ça <strong>remplace entièrement</strong> ta progression actuelle.",
    importTextareaPlaceholder: "H01 L12 T09 B05 C14 ...",
    importApplyBtn: "Remplacer ma progression par cette liste",
    importNoList: "Colle d'abord une liste.",
    importNoValidEntries: "Aucune entrée valide reconnue dans le texte collé.",
    importConfirm: "Remplacer TOUTE ta progression actuelle ({n} entrées) par cette liste de {m} entrées valides{extra} ? Cette action est irréversible.",
    importConfirmExtra: " ({n} jeton(s) ignoré(s) : {list})",
    importResult: "Progression remplacée : {n} entrées appliquées{extra}.",
    importResultExtra: ", {n} ignorée(s)",
    undoBtnTitle: "Annuler la dernière case cochée",
    undoBtnText: "Annuler ({n})",
    resetBtnTitle: "Réinitialiser toute la progression",
    resetBtnText: "Réinitialiser la progression",
    resetConfirm: "Réinitialiser toute la progression (101 données) ? Cette action est irréversible.",
    detailEmpty: "Sélectionne un système à gauche pour voir les obélisques utiles à scanner.",
    copySystemBtnTitle: "Copier le nom du système (pour la carte galactique du jeu)",
    copySystemBtn: "📋 Copier",
    planetLabel: "Planète : {body}",
    resetSystemBtn_one: "Réinitialiser ce système ({n} donnée décochée)",
    resetSystemBtn_other: "Réinitialiser ce système ({n} données décochées)",
    resetSystemConfirm: "Décocher les {n} donnée(s) obtenues sur {system} ? Le reste de ta progression sur les autres systèmes n'est pas touché.",
    manualAddTitle: "Obélisque manqué par Canonn ?",
    manualCodexPlaceholder: "#codex",
    manualObeliskPlaceholder: "Obélisque (ex: C5, optionnel)",
    manualItemsPlaceholder: "Objets (ex: Totem + Urne, optionnel)",
    manualAddBtn: "Ajouter",
    manualInvalidCodex: "Indique un numéro de codex valide.",
    manualCodexTooHigh: "{cat} va seulement jusqu'à #{max}.",
    manualAlreadyDone: "Déjà comptée, notée quand même.",
    manualAdded: "Ajouté à la progression ✓",
    modalCancelBtn: "Annuler",
    modalConfirmBtn: "Confirmer",
    celebrateTitle: "101 / 101",
    celebrateText: "Mission Ram Tah terminée — tous les fragments du Codex Guardian ont été retrouvés.",
    celebrateMeeneBefore: "N'oubliez pas de ramener vos résultats à Ram Tah dans",
    celebrateMeeneAfter: ";)",
    celebrateCopyMeeneBtn: "📋 Meene",
    celebrateCloseBtn: "Fermer",
    dataLoadError: "Erreur de chargement de data.json : {msg} — vérifie que le fichier est bien présent à côté de index.html et relance le serveur.",
    promptCopySystem: "Copie le nom du système :",
    coordLive: "✓ obélisques à jour (live)",
    coordLiveTitle: "Combinaisons d'obélisques récupérées en direct depuis Canonn. Les coordonnées de surface ne sont volontairement plus affichées : même en 'live' elles se sont révélées peu fiables en jeu (Frontier semble parfois les modifier). Fie-toi à la carte et aux lettres/numéros visibles dessus.",
    coordOffline: "⚠ hors-ligne (données de secours)",
    coordOfflineTitle: "Impossible de joindre Canonn (hors-ligne ou bloqué) — ces obélisques viennent de la sauvegarde embarquée et peuvent être obsolètes.",
    coordSyncing: "⏳ synchronisation...",
    coordSyncingTitle: "Synchronisation avec Canonn en cours...",
    activeBadge: "● carte affichée",
    openCanonnBtn: "Ouvrir (GR{id})",
    utileCount_one: "{n} utile",
    utileCount_other: "{n} utile(s)",
    noObelisksLeft: "Aucun obélisque utile restant sur ce site — déjà couvert ailleurs ou terminé.",
  },
  de: {
    welcomeTagline: "Beginne oder setze (dank Import/Export) deine Reise zu Ram Tahs 101 Obelisken fort",
    mapDependencyNote: "Karte bereitgestellt von <strong>Canonn</strong> (externe Community-Seite, unabhängig von Obelisk Compass). Falls sie nicht korrekt angezeigt wird, funktioniert der Rest des Tools (Route, Fortschritt, Missionsfortsetzung) weiterhin normal.",
    tutorialHtml: `<h3><span class="step-num">1</span> Wähle deinen Startpunkt</h3>
<p>Gib dein <strong>aktuelles System</strong> und die <strong>Sprungreichweite deines Schiffs</strong> (in Lichtjahren) im Bereich "Optimierte Route" ein. Diese Angaben dienen nur der Routenberechnung — nichts wird irgendwohin gesendet.</p>

<h3><span class="step-num">2</span> Route berechnen</h3>
<p>Klicke auf <strong>Route berechnen</strong>. Die App wählt und ordnet die zu besuchenden Systeme, um alle 101 Daten so effizient wie möglich abzudecken — eine echte Optimierungs-Engine, keine bloße Schätzung.</p>
<div class="tip">💡 Kurz nach dem Laden der Seite kann eine kurze Synchronisierung mit Canonn stattfinden (zwei rotierende Zahnräder + "Synchronisiere die Galaxie..."). Du kannst warten (meist wenige Sekunden) oder auf <strong>Mit unvollständigen Daten berechnen</strong> klicken, um das zu überspringen.</div>

<h3><span class="step-num">3</span> Bewege dich durch die Route</h3>
<p>Jede Zeile in der Liste ist ein zu besuchendes System:</p>
<ul>
<li>Ein Klick in die <strong>Mitte</strong> einer Zeile zeigt dieses System (Karte + Obelisken) an, ohne etwas neu zu berechnen.</li>
<li>Ein Klick auf das kleine <strong>▶</strong> rechts macht es zu deinem neuen Startpunkt und berechnet die Route von dort aus neu — praktisch, sobald du irgendwo im Spiel angekommen bist.</li>
</ul>
<div class="tip">💡 Wenn Systeme vor dem mit ▶ anvisierten noch nicht abgeschlossen sind, erscheint eine Warnung — nichts geht verloren, sie tauchen einfach neu geordnet in der neuen Liste auf.</div>

<h3><span class="step-num">4</span> Sobald du im Spiel dort bist</h3>
<p>Nutze den Button <strong>📋 Kopieren</strong> neben dem Systemnamen (rechte Spalte), um ihn direkt in die Galaxiekarte des Spiels einzufügen — kein erneutes Eintippen nötig.</p>
<p>Ein Planet kann <strong>mehrere Standorte</strong> haben (Alpha/Beta/Gamma). Der aktuell auf der Karte gezeigte Standort hat einen <strong>orangefarbenen Rahmen</strong> und ist der einzige mit aktiven Kontrollkästchen; die anderen sind ausgegraut, um Fehler zu vermeiden. Klicke auf <strong>Öffnen (GRxx)</strong>, um zu einem anderen Standort auf demselben Planeten zu wechseln.</p>

<h3><span class="step-num">5</span> Obelisken scannen und abhaken</h3>
<p>Verwende für jeden aufgelisteten Obelisken die angegebenen Gegenstände (Totem, Urne, Kugel...) am richtigen Obelisken im Spiel und hake dann das entsprechende Kästchen ab.</p>
<div class="tip">💡 Manche Kombinationen existieren an mehreren verschiedenen Standorten. Das Abhaken einer davon entfernt sie automatisch von allen anderen Standorten, an denen sie vorkam — nie ein Duplikat doppelt erledigen.</div>

<h3><span class="step-num">6</span> Nächster Standort, dann nächstes System</h3>
<p>Sobald ein Standort fertig ist (0 nützliche Obelisken übrig), wechsle über <strong>Öffnen</strong> zu einem anderen Unterstandort desselben Planeten, oder klicke auf das <strong>▶</strong> der nächsten Zeile in der Route, um zum nächsten System weiterzuziehen.</p>

<h3>🛟 Obelisk von Canonn übersehen?</h3>
<p>Unten in der rechten Spalte kannst du über ein kleines Formular manuell einen im Spiel erhaltenen Dateneintrag hinzufügen, den die App nicht als verfügbar anzeigte (Kategorie + Codex-Nummer erforderlich, Obelisk und Gegenstände optional, nur zur eigenen Erinnerung).</p>

<h3>💾 Fortschritt sichern oder fortsetzen</h3>
<p><strong>Exportieren</strong> zeigt deinen Fortschritt als kompakte Liste (z. B. <code>H01 L12 T09...</code>) zum Kopieren und sicheren Aufbewahren. <strong>Importieren / Neu berechnen</strong> lässt dich eine vertrauenswürdige Liste einfügen (z. B. aus deinen Missions-Mails rekonstruiert), um deinen Fortschritt komplett zu ersetzen — nützlich, wenn du die App erst benutzt, nachdem du bei der Mission schon weit warst.</p>

<h3>↩️ Rückgängig machen und zurücksetzen</h3>
<p><strong>Rückgängig</strong> entfernt nur den allerletzten abgehakten Eintrag. In der rechten Spalte erscheint bei Bedarf ein Button <strong>Dieses System zurücksetzen</strong>, um nur die auf dem angezeigten Planeten erhaltenen Daten zu entfernen, ohne den Rest zu berühren. <strong>Fortschritt zurücksetzen</strong> setzt alles zurück (mit Bestätigung).</p>

<h3>🌐 Sprache und Kategorien</h3>
<p>Die Auswahl oben rechts ändert die Interface-Sprache jederzeit (beim ersten Laden automatisch erkannt). Der kleine Pfeil neben dem Fortschrittszähler klappt die Aufschlüsselung nach Kategorie ein oder aus (Geschichte, Sprache, Biologie, Kultur, Technologie).</p>

`,
    tutorialTitle: "So funktioniert Obelisk Compass",
    tutorialBtnTitle: "Anleitung",
    galaxySyncLabel: "Synchronisiere die Galaxie...",
    skipSyncBtn: "Mit unvollständigen Daten berechnen",
    waitingForSync: "Synchronisierung...",
    categoryToggleLabel: "Details und Aktionen",
    startSystemLabel: "Startsystem",
    jumpRangeLabel: "Sprungreichweite deines Schiffs (Lichtjahre)",
    routeOptimizerPitch: "Eine echte Optimierungs-Engine: entfernt überflüssige Standorte und berechnet die exakt optimale Besuchsreihenfolge — keine bloße Annäherung.",
    discoverySyncing: "Neue Standorte werden geprüft...",
    discoveryDone: "{n} neue(r) Standort(e) integriert",
    retargetBtnTitle: "Route ab diesem System neu berechnen",
    copiedBtnLabel: "✓ Kopiert",
    appSubtitle: "(Der Ram Tah Guardian Express 🚂)",
    progression: "Fortschritt",
    dataCount: "{n} / {total} Daten",
    routeOptimisee: "Optimierte Route",
    startSystemPlaceholder: "Aktuelles System (z. B. Synuefe XR-H D11-102, Inkis Startpunkt)",
    jumpRangePlaceholder: "Sprungreichweite (Lj)",
    calculateRoute: "Route berechnen",
    routeSearchingEdsm: "Suche System bei EDSM...",
    routeSystemNotFound: "System \"{name}\" bei EDSM nicht gefunden — Berechnung ohne Startpunkt (der erste Standort wird nur nach Wert gewählt).",
    routeEdsmError: "EDSM nicht erreichbar (Internetverbindung prüfen). Berechnung ohne Startpunkt.",
    routeNoStartSystem: "Kein Startsystem angegeben — Berechnung ohne Startpunkt.",
    routeConfirmUnfinished: "Achtung: {n} System(e) vor diesem sind noch nicht abgeschlossen ({list}).\n\nDie Route ab \"{system}\" neu zu berechnen lässt sie nicht verschwinden (nichts geht verloren), sondern ordnet nur die Besuchsreihenfolge neu.\n\nFortfahren?",
    routeSystemWord_one: "System",
    routeSystemWord_other: "Systeme",
    routeSummary: "{n} {system} ({subSites} Standorte) · {dist} Lj insgesamt · ~{jumps} Sprünge geschätzt",
    routeUncovered: "Achtung: {n} Dateneintrag/-einträge scheinen von keinem bekannten Standort in deiner Datei abgedeckt zu sein.",
    routeCodexCovered: "+{n} Codex",
    routeDistJumps: "{dist} Lj (~{jumps} Sprung/Sprünge) · gesamt {cum} Lj",
    exportBtn: "Exportieren",
    importBtn: "Importieren / Neu berechnen",
    exportHint: "Dein aktueller Fortschritt ({n} Einträge), Format H01 L12 T09... :",
    copyBtn: "Kopieren",
    copiedOk: "In die Zwischenablage kopiert ✓",
    copyFailed: "Automatisches Kopieren fehlgeschlagen — Text ausgewählt, manuell Strg+C.",
    importHintHtml: "Füge hier eine sichere Liste ein (Mails usw.): H01 L12 T09 B05... Das <strong>ersetzt komplett</strong> deinen aktuellen Fortschritt.",
    importTextareaPlaceholder: "H01 L12 T09 B05 C14 ...",
    importApplyBtn: "Meinen Fortschritt durch diese Liste ersetzen",
    importNoList: "Füge zuerst eine Liste ein.",
    importNoValidEntries: "Keine gültigen Einträge im eingefügten Text erkannt.",
    importConfirm: "Deinen GESAMTEN aktuellen Fortschritt ({n} Einträge) durch diese Liste von {m} gültigen Einträgen ersetzen{extra}? Diese Aktion ist unwiderruflich.",
    importConfirmExtra: " ({n} Element(e) ignoriert: {list})",
    importResult: "Fortschritt ersetzt: {n} Einträge angewendet{extra}.",
    importResultExtra: ", {n} ignoriert",
    undoBtnTitle: "Letzten markierten Eintrag rückgängig machen",
    undoBtnText: "Rückgängig ({n})",
    resetBtnTitle: "Gesamten Fortschritt zurücksetzen",
    resetBtnText: "Fortschritt zurücksetzen",
    resetConfirm: "Gesamten Fortschritt zurücksetzen (101 Daten)? Diese Aktion ist unwiderruflich.",
    detailEmpty: "Wähle links ein System, um die scanbaren Obelisken zu sehen.",
    copySystemBtnTitle: "Systemnamen kopieren (für die Galaxiekarte im Spiel)",
    copySystemBtn: "📋 Kopieren",
    planetLabel: "Planet: {body}",
    resetSystemBtn_one: "Dieses System zurücksetzen ({n} Datensatz entfernt)",
    resetSystemBtn_other: "Dieses System zurücksetzen ({n} Datensätze entfernt)",
    resetSystemConfirm: "Die {n} auf {system} erhaltenen Daten entfernen? Der restliche Fortschritt auf anderen Systemen bleibt unberührt.",
    manualAddTitle: "Obelisk von Canonn übersehen?",
    manualCodexPlaceholder: "#Codex",
    manualObeliskPlaceholder: "Obelisk (z. B. C5, optional)",
    manualItemsPlaceholder: "Gegenstände (z. B. Totem + Urne, optional)",
    manualAddBtn: "Hinzufügen",
    manualInvalidCodex: "Gib eine gültige Codex-Nummer ein.",
    manualCodexTooHigh: "{cat} geht nur bis #{max}.",
    manualAlreadyDone: "Bereits gezählt, trotzdem notiert.",
    manualAdded: "Zum Fortschritt hinzugefügt ✓",
    modalCancelBtn: "Abbrechen",
    modalConfirmBtn: "Bestätigen",
    celebrateTitle: "101 / 101",
    celebrateText: "Ram-Tah-Mission abgeschlossen — jedes Fragment des Wächter-Kodex wurde gefunden.",
    celebrateMeeneBefore: "Vergiss nicht, deine Ergebnisse bei Ram Tah in",
    celebrateMeeneAfter: "abzuliefern ;)",
    celebrateCopyMeeneBtn: "📋 Meene",
    celebrateCloseBtn: "Schließen",
    dataLoadError: "Fehler beim Laden von data.json: {msg} — prüfe, ob die Datei neben index.html liegt, und starte den Server neu.",
    promptCopySystem: "Systemnamen kopieren:",
    coordLive: "✓ Obelisken aktuell (live)",
    coordLiveTitle: "Obelisk-Kombinationen live von Canonn abgerufen. Oberflächenkoordinaten werden bewusst nicht mehr angezeigt: auch 'live' erwiesen sie sich im Spiel als unzuverlässig (Frontier scheint sie gelegentlich zu ändern). Verlasse dich auf die Karte und die dort sichtbaren Buchstaben/Zahlen.",
    coordOffline: "⚠ offline (Sicherungsdaten)",
    coordOfflineTitle: "Canonn nicht erreichbar (offline oder blockiert) — diese Daten stammen aus der mitgelieferten Sicherung und können veraltet sein.",
    coordSyncing: "⏳ Synchronisierung...",
    coordSyncingTitle: "Synchronisierung mit Canonn läuft...",
    activeBadge: "● Karte angezeigt",
    openCanonnBtn: "Öffnen (GR{id})",
    utileCount_one: "{n} nützlich",
    utileCount_other: "{n} nützlich",
    noObelisksLeft: "Kein nützlicher Obelisk mehr auf diesem Standort — bereits anderswo abgedeckt oder abgeschlossen.",
  },
  es: {
    welcomeTagline: "Empieza o retoma (gracias a importar/exportar) tu viaje hacia los 101 obeliscos de Ram Tah",
    mapDependencyNote: "Mapa proporcionado por <strong>Canonn</strong> (sitio comunitario externo, independiente de Obelisk Compass). Si no se muestra correctamente, el resto de la herramienta (ruta, progreso, reanudar la misión) sigue funcionando con normalidad.",
    tutorialHtml: `<h3><span class="step-num">1</span> Elige tu punto de partida</h3>
<p>Indica tu <strong>sistema actual</strong> y el <strong>alcance de salto de tu nave</strong> (en años luz) en el bloque "Ruta optimizada". Estos datos solo sirven para calcular el mejor itinerario — no se envía nada a ningún sitio.</p>

<h3><span class="step-num">2</span> Calcula la ruta</h3>
<p>Haz clic en <strong>Calcular ruta</strong>. La app elige y ordena los sistemas a visitar para cubrir los 101 datos de la forma más eficiente posible — un verdadero motor de optimización, no solo una estimación.</p>
<div class="tip">💡 Justo después de cargar la página, puede producirse una breve sincronización con Canonn (dos engranajes girando + "Sincronizando la galaxia..."). Puedes esperar (normalmente unos segundos) o hacer clic en <strong>Calcular con datos parciales</strong> para saltarte la espera.</div>

<h3><span class="step-num">3</span> Avanza por la ruta</h3>
<p>Cada fila de la lista es un sistema a visitar:</p>
<ul>
<li>Hacer clic en el <strong>centro</strong> de una fila muestra ese sistema (mapa + obeliscos) sin recalcular nada.</li>
<li>Hacer clic en el pequeño <strong>▶</strong> de la derecha lo convierte en tu nuevo punto de partida y recalcula la ruta desde ahí — útil una vez que llegas a algún lugar en el juego.</li>
</ul>
<div class="tip">💡 Si los sistemas anteriores al que apuntas con ▶ aún no están terminados, aparece una confirmación para avisarte — no se pierde nada, simplemente reaparecerán reorganizados en la nueva lista.</div>

<h3><span class="step-num">4</span> Una vez allí en el juego</h3>
<p>Usa el botón <strong>📋 Copiar</strong> junto al nombre del sistema (columna derecha) para pegarlo directamente en el mapa galáctico del juego — sin necesidad de volver a escribirlo.</p>
<p>Un planeta puede tener <strong>varios sitios</strong> (Alfa/Beta/Gamma). El sitio mostrado actualmente en el mapa tiene un <strong>contorno naranja</strong> y es el único con casillas activas; los demás aparecen en gris para evitar errores. Haz clic en <strong>Abrir (GRxx)</strong> para cambiar a otro sitio del mismo planeta.</p>

<h3><span class="step-num">5</span> Escanea y marca los obeliscos</h3>
<p>Para cada obelisco listado, usa los objetos indicados (Tótem, Urna, Orbe...) en el obelisco correcto dentro del juego, y luego marca la casilla correspondiente.</p>
<div class="tip">💡 Algunas combinaciones existen en varios sitios distintos. Marcar una la elimina automáticamente de todos los demás sitios donde aparecía — nunca hay que repetir un duplicado.</div>

<h3><span class="step-num">6</span> Siguiente sitio, luego siguiente sistema</h3>
<p>Cuando un sitio esté terminado (0 obeliscos útiles restantes), pasa a otro sub-sitio del mismo planeta mediante <strong>Abrir</strong>, o haz clic en el <strong>▶</strong> de la siguiente fila de la ruta para continuar hacia el próximo sistema.</p>

<h3>🛟 ¿Obelisco pasado por alto por Canonn?</h3>
<p>Al final de la columna derecha, un pequeño formulario permite añadir manualmente un dato obtenido en el juego que la app no mostraba como disponible (categoría + número de códex obligatorios, obelisco y objetos opcionales, solo para tu propia referencia).</p>

<h3>💾 Guardar o retomar tu progreso</h3>
<p><strong>Exportar</strong> muestra tu progreso como una lista compacta (ej: <code>H01 L12 T09...</code>) para copiar y guardar en un lugar seguro. <strong>Importar / Recalcular</strong> te permite pegar una lista fiable (reconstruida a partir de tus correos de misión, por ejemplo) para reemplazar por completo tu progreso — útil si empiezas a usar la app cuando ya llevas mucho avanzado en la misión.</p>

<h3>↩️ Deshacer y reiniciar</h3>
<p><strong>Deshacer</strong> solo elimina la última casilla marcada. En la columna derecha aparece, cuando hace falta, un botón <strong>Reiniciar este sistema</strong> para desmarcar solo los datos obtenidos en el planeta mostrado, sin tocar el resto. <strong>Reiniciar progreso</strong> lo reinicia todo (con confirmación).</p>

<h3>🌐 Idioma y categorías</h3>
<p>El selector arriba a la derecha cambia el idioma de la interfaz en cualquier momento (detectado automáticamente en la primera carga). La pequeña flecha junto al contador de progreso pliega o despliega el detalle por categoría (Historia, Idioma, Biología, Cultura, Tecnología).</p>

`,
    tutorialTitle: "C\u00f3mo usar Obelisk Compass",
    tutorialBtnTitle: "Tutorial",
    galaxySyncLabel: "Sincronizando la galaxia...",
    skipSyncBtn: "Calcular con datos parciales",
    waitingForSync: "Sincronizando...",
    categoryToggleLabel: "Detalle y acciones",
    startSystemLabel: "Sistema de partida",
    jumpRangeLabel: "Alcance de salto de tu nave (años luz)",
    routeOptimizerPitch: "Un verdadero motor de optimización: elimina sitios redundantes y calcula el orden de visita exactamente óptimo — no solo un itinerario aproximado.",
    discoverySyncing: "Comprobando nuevos sitios en Canonn...",
    discoveryDone: "{n} sitio(s) nuevo(s) integrado(s)",
    retargetBtnTitle: "Recalcular la ruta desde este sistema",
    copiedBtnLabel: "✓ Copiado",
    appSubtitle: "(El Guardian Express de Ram Tah 🚂)",
    progression: "Progreso",
    dataCount: "{n} / {total} datos",
    routeOptimisee: "Ruta optimizada",
    startSystemPlaceholder: "Sistema actual (ej: Synuefe XR-H D11-102, el punto de partida de Inki)",
    jumpRangePlaceholder: "Alcance de salto (al)",
    calculateRoute: "Calcular ruta",
    routeSearchingEdsm: "Buscando el sistema en EDSM...",
    routeSystemNotFound: "Sistema \"{name}\" no encontrado en EDSM — cálculo sin punto de partida (el primer sitio se elegirá solo por valor).",
    routeEdsmError: "No se pudo conectar con EDSM (revisa tu conexión a internet). Cálculo sin punto de partida.",
    routeNoStartSystem: "No se indicó sistema de partida — cálculo sin punto de partida.",
    routeConfirmUnfinished: "Atención: {n} sistema(s) antes de este aún no están terminados ({list}).\n\nRecalcular la ruta desde \"{system}\" no los hace desaparecer (no se pierde nada), solo reordena el itinerario según esta nueva posición.\n\n¿Continuar?",
    routeSystemWord_one: "sistema",
    routeSystemWord_other: "sistemas",
    routeSummary: "{n} {system} ({subSites} sitios) · {dist} al en total · ~{jumps} saltos estimados",
    routeUncovered: "Atención: {n} dato(s) no parecen estar cubiertos por ningún sitio conocido en tu archivo.",
    routeCodexCovered: "+{n} códex",
    routeDistJumps: "{dist} al (~{jumps} salto{s}) · acumulado {cum} al",
    exportBtn: "Exportar",
    importBtn: "Importar / Recalcular",
    exportHint: "Tu progreso actual ({n} entradas), formato H01 L12 T09... :",
    copyBtn: "Copiar",
    copiedOk: "Copiado al portapapeles ✓",
    copyFailed: "Copia automática fallida — texto seleccionado, Ctrl+C manualmente.",
    importHintHtml: "Pega aquí una lista fiable (correos, etc.): H01 L12 T09 B05... Esto <strong>reemplaza por completo</strong> tu progreso actual.",
    importTextareaPlaceholder: "H01 L12 T09 B05 C14 ...",
    importApplyBtn: "Reemplazar mi progreso con esta lista",
    importNoList: "Pega primero una lista.",
    importNoValidEntries: "No se reconoció ninguna entrada válida en el texto pegado.",
    importConfirm: "¿Reemplazar TODO tu progreso actual ({n} entradas) por esta lista de {m} entradas válidas{extra}? Esta acción es irreversible.",
    importConfirmExtra: " ({n} término(s) ignorado(s): {list})",
    importResult: "Progreso reemplazado: {n} entradas aplicadas{extra}.",
    importResultExtra: ", {n} ignorada(s)",
    undoBtnTitle: "Deshacer la última casilla marcada",
    undoBtnText: "Deshacer ({n})",
    resetBtnTitle: "Reiniciar todo el progreso",
    resetBtnText: "Reiniciar progreso",
    resetConfirm: "¿Reiniciar todo el progreso (101 datos)? Esta acción es irreversible.",
    detailEmpty: "Selecciona un sistema a la izquierda para ver los obeliscos útiles para escanear.",
    copySystemBtnTitle: "Copiar el nombre del sistema (para el mapa galáctico del juego)",
    copySystemBtn: "📋 Copiar",
    planetLabel: "Planeta: {body}",
    resetSystemBtn_one: "Reiniciar este sistema ({n} dato desmarcado)",
    resetSystemBtn_other: "Reiniciar este sistema ({n} datos desmarcados)",
    resetSystemConfirm: "¿Desmarcar los {n} dato(s) obtenidos en {system}? El resto de tu progreso en otros sistemas no se toca.",
    manualAddTitle: "¿Obelisco pasado por alto por Canonn?",
    manualCodexPlaceholder: "#códex",
    manualObeliskPlaceholder: "Obelisco (ej: C5, opcional)",
    manualItemsPlaceholder: "Objetos (ej: Tótem + Urna, opcional)",
    manualAddBtn: "Añadir",
    manualInvalidCodex: "Indica un número de códex válido.",
    manualCodexTooHigh: "{cat} solo llega hasta el #{max}.",
    manualAlreadyDone: "Ya contabilizado, anotado igualmente.",
    manualAdded: "Añadido al progreso ✓",
    modalCancelBtn: "Cancelar",
    modalConfirmBtn: "Confirmar",
    celebrateTitle: "101 / 101",
    celebrateText: "Misión de Ram Tah completada — se han recuperado todos los fragmentos del Códex Guardián.",
    celebrateMeeneBefore: "No olvides llevar tus resultados a Ram Tah en",
    celebrateMeeneAfter: ";)",
    celebrateCopyMeeneBtn: "📋 Meene",
    celebrateCloseBtn: "Cerrar",
    dataLoadError: "Error al cargar data.json: {msg} — comprueba que el archivo esté junto a index.html y reinicia el servidor.",
    promptCopySystem: "Copia el nombre del sistema:",
    coordLive: "✓ obeliscos actualizados (en vivo)",
    coordLiveTitle: "Combinaciones de obeliscos obtenidas en vivo desde Canonn. Las coordenadas de superficie ya no se muestran a propósito: incluso en modo 'live' resultaron poco fiables en el juego (Frontier parece modificarlas de vez en cuando). Confía en el mapa y en las letras/números que muestra.",
    coordOffline: "⚠ sin conexión (datos de respaldo)",
    coordOfflineTitle: "No se pudo contactar con Canonn (sin conexión o bloqueado) — estos datos vienen de la copia de seguridad incluida y pueden estar desactualizados.",
    coordSyncing: "⏳ sincronizando...",
    coordSyncingTitle: "Sincronizando con Canonn...",
    activeBadge: "● mapa mostrado",
    openCanonnBtn: "Abrir (GR{id})",
    utileCount_one: "{n} útil",
    utileCount_other: "{n} útil(es)",
    noObelisksLeft: "No queda ningún obelisco útil en este sitio — ya cubierto en otro lugar o completado.",
  },
  ru: {
    welcomeTagline: "Начните или продолжите (благодаря экспорту/импорту) путешествие к 101 обелиску Рэм Та",
    mapDependencyNote: "Карта предоставлена <strong>Canonn</strong> (внешний сайт сообщества, независимый от Obelisk Compass). Если она отображается некорректно, остальная часть инструмента (маршрут, прогресс, возобновление миссии) продолжает работать в обычном режиме.",
    tutorialHtml: `<h3><span class="step-num">1</span> Выберите точку отправления</h3>
<p>Укажите вашу <strong>текущую систему</strong> и <strong>дальность прыжка вашего корабля</strong> (в световых годах) в блоке "Оптимальный маршрут". Эти данные используются только для расчёта лучшего маршрута — никуда не отправляются.</p>

<h3><span class="step-num">2</span> Рассчитайте маршрут</h3>
<p>Нажмите <strong>Рассчитать маршрут</strong>. Приложение выбирает и упорядочивает системы для посещения, чтобы максимально эффективно охватить все 101 данных — настоящий движок оптимизации, а не просто оценка.</p>
<div class="tip">💡 Сразу после загрузки страницы может произойти короткая синхронизация с Canonn (две вращающиеся шестерёнки + "Синхронизация галактики..."). Можно подождать (обычно несколько секунд) или нажать <strong>Рассчитать по неполным данным</strong>, чтобы пропустить ожидание.</div>

<h3><span class="step-num">3</span> Двигайтесь по маршруту</h3>
<p>Каждая строка списка — это система для посещения:</p>
<ul>
<li>Клик в <strong>центр</strong> строки показывает эту систему (карта + обелиски), ничего не пересчитывая.</li>
<li>Клик на маленький <strong>▶</strong> справа делает её новой точкой отправления и пересчитывает маршрут оттуда — удобно, когда вы уже куда-то прилетели в игре.</li>
</ul>
<div class="tip">💡 Если системы перед той, на которую вы нацелились через ▶, ещё не завершены, появится предупреждение — ничего не потеряется, они просто снова появятся в новом списке в другом порядке.</div>

<h3><span class="step-num">4</span> Когда вы на месте в игре</h3>
<p>Используйте кнопку <strong>📋 Копировать</strong> рядом с названием системы (правая колонка), чтобы вставить его прямо в галактическую карту игры — не нужно вводить заново.</p>
<p>На планете может быть <strong>несколько сайтов</strong> (Альфа/Бета/Гамма). Сайт, отображаемый сейчас на карте, имеет <strong>оранжевую рамку</strong> и только у него активны флажки; остальные затемнены во избежание ошибок. Нажмите <strong>Открыть (GRxx)</strong>, чтобы переключиться на другой сайт той же планеты.</p>

<h3><span class="step-num">5</span> Сканируйте и отмечайте обелиски</h3>
<p>Для каждого обелиска в списке используйте указанные предметы (Тотем, Урна, Сфера...) на нужном обелиске в игре, затем отметьте соответствующий флажок.</p>
<div class="tip">💡 Некоторые комбинации существуют на нескольких разных сайтах. Отметка одной автоматически убирает её со всех других сайтов, где она встречалась — никогда не придётся делать дубликат дважды.</div>

<h3><span class="step-num">6</span> Следующий сайт, затем следующая система</h3>
<p>Когда сайт завершён (0 полезных обелисков осталось), перейдите к другому под-сайту той же планеты через <strong>Открыть</strong>, или нажмите <strong>▶</strong> следующей строки маршрута, чтобы перейти к следующей системе.</p>

<h3>🛟 Обелиск пропущен Canonn?</h3>
<p>Внизу правой колонки небольшая форма позволяет вручную добавить запись, полученную в игре, но не показанную приложением как доступную (категория и номер кодекса обязательны, обелиск и предметы — по желанию, просто для памяти).</p>

<h3>💾 Сохранить или продолжить прогресс</h3>
<p><strong>Экспорт</strong> показывает ваш прогресс в виде компактного списка (напр. <code>H01 L12 T09...</code>) для копирования и надёжного хранения. <strong>Импорт / Пересчёт</strong> позволяет вставить надёжный список (например, восстановленный из писем миссии), чтобы полностью заменить ваш прогресс — полезно, если вы начинаете пользоваться приложением, уже далеко продвинувшись в миссии.</p>

<h3>↩️ Отмена и сброс</h3>
<p><strong>Отменить</strong> убирает только самую последнюю отмеченную запись. В правой колонке при необходимости появляется кнопка <strong>Сбросить эту систему</strong>, снимающая отметки только с данных, полученных на отображаемой планете, не затрагивая остальное. <strong>Сбросить прогресс</strong> сбрасывает всё (с подтверждением).</p>

<h3>🌐 Язык и категории</h3>
<p>Переключатель вверху справа меняет язык интерфейса в любой момент (определяется автоматически при первой загрузке). Маленькая стрелка рядом со счётчиком прогресса сворачивает или разворачивает разбивку по категориям (История, Язык, Биология, Культура, Технология).</p>

`,
    tutorialTitle: "\u041a\u0430\u043a \u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u044c\u0441\u044f Obelisk Compass",
    tutorialBtnTitle: "\u0418\u043d\u0441\u0442\u0440\u0443\u043a\u0446\u0438\u044f",
    galaxySyncLabel: "Синхронизация галактики...",
    skipSyncBtn: "Рассчитать по неполным данным",
    waitingForSync: "Синхронизация...",
    categoryToggleLabel: "Детали и действия",
    startSystemLabel: "Начальная система",
    jumpRangeLabel: "Дальность прыжка вашего корабля (св. лет)",
    routeOptimizerPitch: "Настоящий движок оптимизации: устраняет избыточные сайты и вычисляет точно оптимальный порядок посещения — а не приблизительный маршрут.",
    discoverySyncing: "Проверка новых сайтов Canonn...",
    discoveryDone: "Добавлено новых сайтов: {n}",
    retargetBtnTitle: "Пересчитать маршрут, начиная с этой системы",
    copiedBtnLabel: "✓ Скопировано",
    appSubtitle: "(Guardian Express Рэм Та 🚂)",
    progression: "Прогресс",
    dataCount: "{n} / {total} данных",
    routeOptimisee: "Оптимальный маршрут",
    startSystemPlaceholder: "Текущая система (напр. Synuefe XR-H D11-102, стартовая точка Inki)",
    jumpRangePlaceholder: "Дальность прыжка (св. лет)",
    calculateRoute: "Рассчитать маршрут",
    routeSearchingEdsm: "Поиск системы на EDSM...",
    routeSystemNotFound: "Система «{name}» не найдена на EDSM — расчёт без точки отправления (первая точка будет выбрана только по ценности).",
    routeEdsmError: "Не удалось подключиться к EDSM (проверьте интернет-соединение). Расчёт без точки отправления.",
    routeNoStartSystem: "Стартовая система не указана — расчёт без точки отправления.",
    routeConfirmUnfinished: "Внимание: {n} система(ы) перед этой ещё не завершены ({list}).\n\nПерерасчёт маршрута от «{system}» не удаляет их (ничего не потеряно), а просто меняет порядок посещения.\n\nПродолжить?",
    routeSystemWord_one: "система",
    routeSystemWord_other: "систем",
    routeSummary: "{n} {system} ({subSites} сайтов) · {dist} св. лет всего · ~{jumps} прыжков (оценка)",
    routeUncovered: "Внимание: {n} данных, похоже, не покрыты ни одним известным сайтом в вашем файле.",
    routeCodexCovered: "+{n} кодекс",
    routeDistJumps: "{dist} св. лет (~{jumps} прыжк.) · всего {cum} св. лет",
    exportBtn: "Экспорт",
    importBtn: "Импорт / Пересчёт",
    exportHint: "Ваш текущий прогресс ({n} записей), формат H01 L12 T09... :",
    copyBtn: "Копировать",
    copiedOk: "Скопировано в буфер обмена ✓",
    copyFailed: "Автокопирование не удалось — текст выделен, нажмите Ctrl+C вручную.",
    importHintHtml: "Вставьте сюда надёжный список (письма и т.д.): H01 L12 T09 B05... Это <strong>полностью заменит</strong> ваш текущий прогресс.",
    importTextareaPlaceholder: "H01 L12 T09 B05 C14 ...",
    importApplyBtn: "Заменить мой прогресс этим списком",
    importNoList: "Сначала вставьте список.",
    importNoValidEntries: "В вставленном тексте не распознано ни одной корректной записи.",
    importConfirm: "Заменить ВЕСЬ ваш текущий прогресс ({n} записей) этим списком из {m} корректных записей{extra}? Это действие необратимо.",
    importConfirmExtra: " (проигнорировано {n} элемент(ов): {list})",
    importResult: "Прогресс заменён: применено {n} записей{extra}.",
    importResultExtra: ", проигнорировано {n}",
    undoBtnTitle: "Отменить последнюю отмеченную запись",
    undoBtnText: "Отменить ({n})",
    resetBtnTitle: "Сбросить весь прогресс",
    resetBtnText: "Сбросить прогресс",
    resetConfirm: "Сбросить весь прогресс (101 данных)? Это действие необратимо.",
    detailEmpty: "Выберите систему слева, чтобы увидеть полезные для сканирования обелиски.",
    copySystemBtnTitle: "Скопировать название системы (для галактической карты игры)",
    copySystemBtn: "📋 Копировать",
    planetLabel: "Планета: {body}",
    resetSystemBtn_one: "Сбросить эту систему ({n} запись снята)",
    resetSystemBtn_other: "Сбросить эту систему ({n} записей снято)",
    resetSystemConfirm: "Снять отметки с {n} данных, полученных в {system}? Остальной прогресс по другим системам не затронут.",
    manualAddTitle: "Обелиск пропущен Canonn?",
    manualCodexPlaceholder: "#кодекс",
    manualObeliskPlaceholder: "Обелиск (напр. C5, необязательно)",
    manualItemsPlaceholder: "Предметы (напр. Тотем + Урна, необязательно)",
    manualAddBtn: "Добавить",
    manualInvalidCodex: "Укажите корректный номер кодекса.",
    manualCodexTooHigh: "{cat} доходит только до #{max}.",
    manualAlreadyDone: "Уже учтено, но всё равно записано.",
    manualAdded: "Добавлено в прогресс ✓",
    modalCancelBtn: "Отмена",
    modalConfirmBtn: "Подтвердить",
    celebrateTitle: "101 / 101",
    celebrateText: "Миссия Рэм Та завершена — все фрагменты Кодекса Стражей найдены.",
    celebrateMeeneBefore: "Не забудьте отнести результаты Рэм Та в",
    celebrateMeeneAfter: ";)",
    celebrateCopyMeeneBtn: "📋 Meene",
    celebrateCloseBtn: "Закрыть",
    dataLoadError: "Ошибка загрузки data.json: {msg} — проверьте, что файл находится рядом с index.html, и перезапустите сервер.",
    promptCopySystem: "Скопируйте название системы:",
    coordLive: "✓ обелиски актуальны (live)",
    coordLiveTitle: "Комбинации обелисков получены напрямую от Canonn. Координаты поверхности намеренно больше не отображаются: даже в режиме live они оказались ненадёжными в игре (Frontier, похоже, иногда их меняет). Доверяйте карте и буквам/цифрам на ней.",
    coordOffline: "⚠ офлайн (резервные данные)",
    coordOfflineTitle: "Не удалось связаться с Canonn (офлайн или заблокировано) — эти данные взяты из встроенной резервной копии и могут быть устаревшими.",
    coordSyncing: "⏳ синхронизация...",
    coordSyncingTitle: "Синхронизация с Canonn...",
    activeBadge: "● карта показана",
    openCanonnBtn: "Открыть (GR{id})",
    utileCount_one: "{n} полезно",
    utileCount_other: "{n} полезно",
    noObelisksLeft: "На этом сайте не осталось полезных обелисков — уже покрыто в другом месте или завершено.",
  },
};

// ---- helpers ----

function detectLanguage() {
  try {
    const saved = localStorage.getItem("ramtah_lang");
    if (saved && SUPPORTED_LANGS.includes(saved)) return saved;
  } catch (e) { /* ignore */ }
  const nav = (navigator.language || "en").slice(0, 2).toLowerCase();
  return SUPPORTED_LANGS.includes(nav) ? nav : "en";
}

let currentLang = detectLanguage();

function setLang(lang) {
  if (!SUPPORTED_LANGS.includes(lang)) return;
  currentLang = lang;
  try { localStorage.setItem("ramtah_lang", lang); } catch (e) { /* ignore */ }
}

function getLang() { return currentLang; }

// Simple {placeholder} interpolation
function fmt(str, vars) {
  if (!vars) return str;
  return str.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
}

function t(key, vars) {
  const dict = STRINGS[currentLang] || STRINGS.en;
  const str = dict[key] !== undefined ? dict[key] : (STRINGS.en[key] !== undefined ? STRINGS.en[key] : key);
  return fmt(str, vars);
}

// Pluralized variant: picks key_one for n===1, key_other otherwise (simple EN/FR/DE/ES/RU-friendly approximation)
function tn(key, n, vars) {
  const suffix = n === 1 ? "_one" : "_other";
  return t(key + suffix, Object.assign({ n }, vars));
}

function itemLabel(name) {
  if (!name) return name;
  const dict = ITEM_TRANSLATIONS[currentLang] || ITEM_TRANSLATIONS.en;
  return dict[name] || ITEM_TRANSLATIONS.en[name] || name;
}

function catLabel(name) {
  if (!name) return name;
  const dict = CATEGORY_TRANSLATIONS[currentLang] || CATEGORY_TRANSLATIONS.en;
  return dict[name] || CATEGORY_TRANSLATIONS.en[name] || name;
}

// Applies translations to every element with data-i18n / data-i18n-placeholder /
// data-i18n-title / data-i18n-html attributes, and rebuilds the language selector.
function applyStaticTranslations() {
  document.documentElement.lang = currentLang;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    el.textContent = t(el.getAttribute("data-i18n"));
  });
  document.querySelectorAll("[data-i18n-html]").forEach(el => {
    el.innerHTML = t(el.getAttribute("data-i18n-html"));
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    el.placeholder = t(el.getAttribute("data-i18n-placeholder"));
  });
  document.querySelectorAll("[data-i18n-title]").forEach(el => {
    el.title = t(el.getAttribute("data-i18n-title"));
  });
  document.querySelectorAll("[data-i18n-cat]").forEach(el => {
    el.textContent = catLabel(el.getAttribute("data-i18n-cat"));
  });
  document.title = "Obelisk Compass";
}
