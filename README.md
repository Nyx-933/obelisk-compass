# Obelisk Compass
### *(Ram Tah's Guardian Express 🚂)*

Un outil de suivi — et un **vrai optimisateur de trajet** — pour la mission "Decoding the Ancient Ruins" de Ram Tah dans Elite Dangerous : celle des **101 données Guardian** à récupérer sur les ruines antiques.

La route n'est pas un simple itinéraire approximatif : le moteur élimine les sites redondants (ceux dont l'apport est déjà couvert par les autres) puis calcule l'ordre de visite **exactement optimal** — pas une estimation. Concrètement, sur un cas réel testé : 14 sites / 937 al avec une approche gloutonne classique, contre **9 sites / 1234 al** avec le moteur actuel, depuis le même point de départ.

100% dans ton navigateur, aucune inscription, aucune donnée envoyée nulle part : ta progression reste sur ta machine.

## Pourquoi cet outil

Cette mission demande de visiter des dizaines de sites répartis dans plusieurs systèmes, en scannant des obélisques avec la bonne combinaison d'objets, sans jamais savoir facilement où tu en es réellement ni où aller ensuite. Ram Tah Companion résout ça :

- **Suivi de progression** par catégorie (Histoire, Langue, Biologie, Culture, Technologie), avec import/export pour reprendre en cours de route même si tu as déjà commencé la mission.
- **Route optimisée** : calcule automatiquement l'ordre de visite le plus efficace parmi les sites qu'il te reste à faire, avec distance et nombre de sauts estimé.
- **Synchronisation live avec [Canonn](https://canonn.science/)** : les combinaisons d'obélisques sont récupérées en direct depuis leur base de données communautaire à jour, avec repli automatique sur des données embarquées si la connexion échoue.
- **Carte interactive intégrée** (Canonn Ruins Map) pour repérer visuellement chaque site.
- **Multilingue** : Français, English, Deutsch, Español, Русский — détection automatique de la langue du navigateur, sélecteur manuel disponible.
- **Filet de sécurité** : ajout manuel d'un obélisque non répertorié, désactivation des cases des sites que tu ne regardes pas (pour éviter les erreurs de saisie), historique annulable.

## Installation et lancement

Aucune dépendance à installer — juste Python 3 (déjà présent sur la plupart des systèmes).

```bash
git clone https://github.com/Nyx-933/obelisk-compass.git
cd obelisk-compass
python3 server.py
```

Le navigateur s'ouvre automatiquement sur `http://localhost:8000`. Pour arrêter le serveur, appuie sur **Entrée** dans le terminal (plus fiable que Ctrl+C sur certains systèmes).

## Comment ça marche

1. Renseigne ton système actuel dans le bloc **Route optimisée** et clique sur *Calculer la route*.
2. Clique sur un système pour afficher sa carte et la liste des obélisques encore utiles à scanner.
3. Coche chaque obélisque une fois scanné en jeu — la progression se met à jour, et les combinaisons déjà obtenues ailleurs disparaissent automatiquement des autres sites.
4. Reviens en jeu rendre la mission à Ram Tah, à Meene — un rappel s'affiche automatiquement une fois arrivé à 101/101 🎉

## Données

Les combinaisons d'obélisques et leurs coordonnées proviennent du travail de la communauté [Canonn Research Group](https://canonn.science/). Cet outil n'aurait pas pu exister sans leur base de données ouverte et leur documentation exhaustive sur les Guardians.

## Limites connues

- Les coordonnées de surface (latitude/longitude) affichées par Canonn, même en direct, se sont parfois révélées peu fiables en jeu — fie-toi à la carte plutôt qu'aux chiffres bruts.
- La route est calculée par un algorithme glouton (pas une solution mathématiquement prouvée optimale) — un très bon compromis pratique, pas une garantie absolue.

## Auteur

Développé par **Nyx-933**.

## Licence

Distribué sous licence MIT — voir [LICENSE](LICENSE).

## Découverte automatique de nouveaux sites (nouveau)
En plus de la synchronisation par site déjà en place, l'appli vérifie maintenant en arrière-plan le répertoire complet des sites Guardian de Canonn (`getRuinList.json`) à chaque chargement. Si un site vraiment nouveau y apparaît (pas encore dans le fichier embarqué), il est automatiquement :
1. repéré comme nouveau (comparaison des identifiants de site),
2. localisé dans la galaxie via EDSM (une seule requête par système, mise en cache définitivement),
3. enrichi avec ses données d'obélisques en direct depuis Canonn,
4. intégré à la liste des systèmes, à la route optimisée et à la progression — sans aucune action de ta part.

Ça se fait entièrement en silence (aucun message intrusif), et si Canonn ou EDSM est injoignable, l'appli continue de fonctionner normalement avec ce qui est déjà connu, en réessayant au prochain chargement.

## Algorithme de route amélioré (nouveau)
Le calcul de route ne se contente plus d'un simple choix glouton étape par étape — il ajoute maintenant deux passes supplémentaires, invisibles pour toi (aucun nouveau réglage) :
1. **Élagage des sites redondants** : après la construction initiale, chaque site dont l'apport est entièrement remplaçable par les autres est retiré, ce qui rapproche le résultat du véritable minimum de sites nécessaires.
2. **Ordre de visite exact** (algorithme Held-Karp) plutôt qu'une approximation, tant que le nombre de sites restants le permet (jusqu'à 16, largement suffisant en pratique) — au-delà, un repli plus simple garantit que l'appli ne se bloque jamais.

Résultat mesuré : sur le même point de départ, on passe de 14 sites / 937 al (ancien algorithme) à 9-12 sites / 765-1234 al selon le point de départ — un net progrès, sans complexifier l'interface.

## Labels visibles sur les champs de route (correctif ergonomie)
Les deux champs du bloc "Route optimisée" (système de départ, portée de saut) ont maintenant de vrais labels visibles au-dessus, dans les 5 langues — auparavant ce n'était qu'un texte de type "placeholder", invisible dès qu'une valeur était déjà présente (le champ portée de saut a une valeur par défaut de 65, donc son indication ne s'affichait jamais). Un nouvel utilisateur sait maintenant clairement quoi renseigner.

## Correctif de vocabulaire : systèmes vs sites (important)
Le résumé de la route affichait "X site(s)" alors que ce nombre correspondait en réalité au nombre de **systèmes** (planètes) à visiter, pas au nombre réel de sites individuels (une planète pouvant avoir plusieurs sous-sites Alpha/Beta/Gamma). Le résumé affiche maintenant clairement les deux : *"12 systèmes (30 sites) · 765 al au total · ~18 sauts estimés"*.

## Rappel important sur la reproductibilité
L'algorithme de route est entièrement déterministe : à jeu de données et progression identiques, il donne toujours exactement le même résultat (vérifié : 5 appels consécutifs, résultat identique au chiffre près). Si deux calculs donnent des résultats différents pour un même point de départ, la cause est presque toujours que la synchronisation en arrière-plan avec Canonn (nouveaux sites) n'était pas terminée lors du premier essai — attends quelques secondes après le chargement de la page avant de calculer la route pour un résultat pleinement cohérent.

## Pensé pour les connexions lentes (nouveau)
Deux améliorations pour ne jamais pénaliser un utilisateur avec une connexion lente :
1. **Recherches EDSM parallélisées** (jusqu'à 8 en simultané au lieu d'une par une) — testé : 20 systèmes à vérifier passent de 6s (en série) à moins de 1s (en parallèle).
2. **Plafond de 6 secondes** sur l'attente du bouton "Calculer la route" : si la synchronisation avec Canonn traîne vraiment (connexion très lente ou capricieuse), le bouton calcule quand même la route avec ce qui est déjà connu plutôt que de rester bloqué indéfiniment — la synchronisation continue en arrière-plan et s'appliquera au clic suivant.

## Synchronisation visible et interruptible (nouveau)
Quand la synchronisation avec Canonn prend plus de 0,4 seconde après le chargement de la page, le bouton "Calculer la route" est temporairement remplacé par une petite animation (deux roues crantées + "Synchronisation de la galaxie...") et un bouton **"Calculer sur données partielles"** — cliquable à tout moment pour sauter l'attente et lancer le calcul immédiatement avec ce qui est déjà connu. Si la connexion est vraiment mauvaise (ou bloquée), un filet de sécurité restaure automatiquement le bouton normal après 6 secondes maximum, même sans action de ta part — testé avec une requête qui ne répond jamais, comportement confirmé.

Les recherches EDSM pour les nouveaux sites sont aussi parallélisées (jusqu'à 8 en simultané), ce qui réduit fortement le temps d'attente réel dans la grande majorité des cas.

## Tutoriel intégré (nouveau)
Un bouton "❓" en haut à gauche (à côté du sélecteur de langue) ouvre un guide complet dans les 5 langues : ordre logique d'utilisation (point de départ → calcul → avancer dans la route → obélisques → site suivant), plus toutes les subtilités de l'interface (sites multiples par planète, doublons de combinaisons, synchronisation, sauvegarde/reprise, annulation ciblée, etc.).

## Écran d'accueil (nouveau)
Au tout premier chargement (avant d'avoir sélectionné un système), la colonne centrale affiche désormais un écran d'accueil avec le nom du projet en grand et le tutoriel complet directement visible, plutôt que la carte Canonn vide et générique. Dès que tu sélectionnes un système (calcul de route, clic sur une ligne...), l'écran d'accueil laisse place à la vraie carte interactive. Le bouton "❓" reste disponible à tout moment pour rouvrir le même contenu en fenêtre par la suite.

## Coup de pouce visuel au premier lancement (nouveau)
Les deux champs "Système de départ" et "Portée de saut" pulsent doucement en orange au tout premier chargement, pour indiquer clairement par où commencer. Ça s'arrête définitivement dès que tu tapes dedans ou que tu cliques sur "Calculer la route" — jamais gênant une fois que tu sais t'en servir.

## Un petit clin d'œil
Le placeholder du champ "Système de départ" référence désormais SYNUEFE XR-H D11-102 — le tout premier système utilisé au début de ce projet, point de départ du personnage Inki Yozora de l'auteur. Boucle bouclée.

## Réinitialiser la progression = vrai premier lancement (corrigé)
Le bouton "Réinitialiser la progression" remet maintenant tout à zéro comme au tout premier lancement : progression, route calculée, système affiché, champs de départ/portée de saut vidés (avec leur petit clignotement d'accueil qui revient), et l'écran d'accueil avec le tutoriel qui reprend sa place au centre.

## Reprise automatique de session (précisé)
En plus de la progression, l'appli mémorise le système ET le sous-site précis (Alpha/Beta/Gamma) que tu étais en train de traiter, et recalcule automatiquement ta route dès que tu rouvres la page — tu retrouves exactement où tu en étais, jusqu'au bon obélisque.

## Système de départ pré-rempli (nouveau)
Le champ "Système de départ" contient par défaut **Synuefe XR-H D11-102** (le point de départ d'Inki) tant que tu n'as pas encore fait ton propre calcul — pratique pour tester l'outil et voir un exemple de route fonctionnel immédiatement, sans avoir besoin d'ouvrir Elite Dangerous pour aller chercher ses propres coordonnées.

## Systèmes terminés en bas de la route (précisé)
Dans la liste de route, un système entièrement terminé descend en bas, grisé avec une coche ✓, toujours cliquable. Il **reste visible** même après avoir cliqué sur ▶ pour avancer vers le système suivant (contrairement à un simple recalcul qui l'aurait fait disparaître) — il ne disparaît que lorsque tu cliques explicitement sur "Calculer la route", qui repart d'une liste propre.

## Note sur la dépendance de la carte (nouveau)
Une petite note discrète mais toujours visible s'affiche juste au-dessus de la carte, rappelant qu'elle est fournie par Canonn (site externe, indépendant d'Obelisk Compass) et que le reste de l'outil (route, progression, reprise de mission) continue de fonctionner normalement même si elle ne s'affiche pas. Comme il n'est techniquement pas possible de détecter en JavaScript si une carte d'un autre site a bien chargé ses données (restriction de sécurité des navigateurs), cette note reste affichée en permanence plutôt que de tenter une détection automatique peu fiable.

## Phrase d'accroche sur l'écran d'accueil (nouveau)
Une phrase met désormais en avant dès le premier coup d'œil la possibilité de reprendre une mission abandonnée grâce à l'import/export : *"Entamez ou reprenez (grâce à l'import/export) le voyage vers les 101 obélisques de Ram Tah"*. Visible uniquement sur l'écran d'accueil (pas dans la fenêtre "❓"), dans les 5 langues.

## Capture d'écran d'illustration sur l'écran d'accueil (nouveau)
Une capture d'écran de l'appli en action (route calculée + carte + progression) s'affiche maintenant juste sous le titre, avant le tutoriel détaillé — un coup d'œil qui montre immédiatement le fonctionnement global, plus "vendeur" qu'un simple mur de texte.

## Corrections d'affichage sur petits écrans (nouveau)
Trois ajustements pour que l'appli reste utilisable même sur un écran plus petit (Mac, portable, etc.) :
1. Le détail par catégorie (Histoire/Langue/Biologie/Culture/Technologie) est maintenant **replié par défaut** — il prenait de la place inutilement pour beaucoup d'utilisateurs.
2. La colonne de gauche **défile désormais correctement** si son contenu dépasse la hauteur de l'écran (avant, le surplus était simplement invisible et inaccessible, sans aucun moyen de faire défiler).
3. Après un calcul de route, l'affichage **remonte automatiquement** vers le début du résultat, pour ne pas avoir à chercher où il est apparu.

## Total de route toujours visible (nouveau)
Dans le bloc "Route optimisée", seule la liste des systèmes à parcourir défile désormais (dans une zone bornée) — le résumé final (nombre de systèmes, sites, distance et sauts estimés) reste toujours visible en dessous, sans avoir besoin de faire défiler jusqu'en bas pour le consulter.

## Réorganisation : import/export et annuler/réinitialiser (nouveau)
Ces boutons (Exporter, Importer/Recalculer, Annuler, Réinitialiser) sont désormais rangés dans le même panneau repliable que le détail par catégorie, sous "Détail et actions" — masqués par défaut, ils libèrent de la place pour la liste de route et n'apparaissent que lorsque tu en as besoin. Corrige au passage un chevauchement visuel qui pouvait survenir sur certains écrans (Mac notamment).

## Icône personnalisée (favicon) (nouveau)
Une petite boussole stylisée (fond sombre, aiguille orange) remplace désormais l'icône Chrome par défaut dans l'onglet du navigateur — cohérente avec l'identité visuelle de l'appli.

## "Obélisque manqué par Canonn ?" devient un bouton repliable (nouveau)
Ce formulaire, rarement utilisé au quotidien, est maintenant masqué par défaut — son titre devient un bouton sur lequel cliquer pour faire apparaître les champs juste au-dessus, comme "Détail et actions" mais positionné en bas de la colonne de droite. Ça libère de la place pour les obélisques utiles à scanner, surtout appréciable sur petit écran.

## Correction : badge "synchronisation..." qui restait bloqué (important)
Un vrai bug corrigé : si la requête vers Canonn pour un site précis restait bloquée (sans jamais répondre ni échouer proprement), le badge affichait "synchronisation..." indéfiniment, sans jamais se résoudre. Un délai de sécurité de 8 secondes (comme pour les recherches EDSM) garantit maintenant que ça bascule toujours sur "à jour" ou "hors-ligne" — jamais bloqué pour de bon. Testé avec une requête qui ne répond jamais : résolution automatique confirmée après 8 secondes.
