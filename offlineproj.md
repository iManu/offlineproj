
[TOC]



#JSTOTAL

var names = ["Benoît", "Dorothée", "Emmanuel", "Jean-Baptiste",
  "Jean-Christophe", "Jennifer", "Salifou", "Samuel", "Vincent", "Yvan"];

##Jour 1

[Slide #1](http://delicious-insights.com/js-total/jst-day1)

### Objects, strings

JS est object.
Pas de tri dans les objects.

.slice() fonctionne sur les objects et les tableaux

### Dates

+new Date() => timestamp (millisecondes !)
new Date(1410855765011)
.getYear() donne l'année depuis 1900 (2014 == 114)

Pour les dates, il y a [moment.js](http://momentjs.com)

### Tableaux

Les tableaux c'est numérique, les objects c'est clé+chaine de caractère

le for() est la seule bonne manière de boucler

Déclarer le length en var dans le for
for (var i=0, **taille = names.length**; i < **taille**; i++) console.log(i, names[i])

[UnderscoreJS](http://underscorejs.org/) est pratique pour tout un tas de trucs

.slice() est aussi très utile sur les tableaux
.s**p**lice() est modifiant, au contraire de slice() qui ne touche pas au tableau

### Egalités

Toujours utiliser des égalités strictes 

### Captain []

// Moins La Lose
var angle = 60, result = useSin ? Math.sin(angle) : Math.cos(angle);
// Trop La Classe
var angle = 60, result = Math\[useSin ? 'sin' : 'cos'](angle);
// == selection dynamique d'une propriété 
// Cas classiques :
element\[display ? 'show' : 'hide']();
element\[(enable ? 'add' : 'remove') + 'Class']('enabled'); // too much

### in & delete

in : est-ce que la propriété existe dans l'objet donné ?
delete : seule manière de supprimer vraiment du garbage collector
hasownproperty: quand in ne suffit plus (tester les boucles for in)

### Truthy or falsy
// 1. undefined, null, false, 0, '', NaN -> false
// 2. N'importe quoi d'autre             -> true

Toujours vérifier le type d'un argument

### parseInt

toujours spécifier la base 10 avec parseInt('02014', 10) // IE<9, Node < 0.10.0


### Constructeurs et prototypes

les notions de classes ne sont pas implémentées, on va utiliser prototype..

#### Contructeur

new ...
var implicite : this
référence : constructor (par convention, avec une majuscule)

	note: erreur custom : throw new Error('message...')

#### Instance / Prototype

prototype est un object, vivant (similaire à $.fn de jQuery)

### Programation fonctionnelle

Fonctions de premier ordre (ce qu'on fait tout le temps)

Fonctions d'ordre supérieur: les callbacks, renvoi de fonction..

### Bien déclarer

Attention au hoisting (déclarations déplacées en haut de la pile)

### Portée

Toujours déclarer avec **var**, toujours.
La portée des var est forcement toujours une fonction (pas for, ni if), sinon global

	Le mode strict 'use strict'; TIP: un par fonction, pas forcement sur tout le doc

ES6: let

### Masquage

Facette oubliée de JS, si vars avec le même nom mais pas dans les mêmes scopes, la var extérieure peut être difficilement récupérable.

### Closures

Fonction dans les fonctions. return function avec des vals définie au dessus permet de conserver différentes valeurs si fonction parente utilisée plusieurs fois.

Attention aux fuites de mémoires, penser à bien vider le garbage !!

Pattern de ouf:
```
FERMETURES LEXICALES

var publicFx = (function() {
  var callCount = 0;

  function publicFx() { // declarer function comme ça === un var
    var stamp = Date.now();
    return function() {
      console.log(++callCount, stamp);
    };
  }

  return publicFx;
})();
```

### varargs

Paramètres dynamique

On peut utiliser la variable `arguments`, boucler dessus, faire du polymorphisme.
Ex. avec jQuery `.on( events [, selector ] [, data ], handler )`

### Module patterns


### Binding

var that = this; OU en callback de la fonction utilisée, OU :

#### avec Apply & Call

Font la même chose mais différement.

#### Ou bind() (ES5)

### Throttling

Cool en prod.
Ne pas exécuter une fonction trop souvent.

(Voir code de l'exo *jst_throttling.js*)

UndescoreJS possède une fonction throttle.

On peut aller plus loin avec la création dynamique de fonctions, tel Ruby, et avec des possibilités en plus.

### Héritage prototypal

Attention à l'héritage académique. Préférer via une fonction anonyme telles que les frameworks l'utilise, avec une fonction telles que `inherit(Geek, Person);`

Ne pas casser la chaîne prototypale.

#### Héritage léger

Les mixins, pour partager des implémentations


### Membre Static / Instance

C'est l'inverse de partager un var sur toutes les instances.

## Jour 2

[Slides #2](http://delicious-insights.com/js-total/jst-day2/#/intro)

### JSHint

[le site JSHint](http://jshint.com/)

le fichier .jshintrc à mettre dans le projet sous OSX, sinon dans user pour Ouinouin.

Dans le fichier js sur la première ligne, on peut indiquer quelles sont les vars globales pour éviter que lint ne crache une erreur `/* globals mavar, mavar2 */`

### Débug pas à pas

Dans la console, les breakpoints (sur la ligne, conditionnels, DOM changes, XHR)..

Sinon, dans le js source si on a la main dessus, le mot clé `debugger` 

Dans la devTool Chrome /sources, le bouton "Caught on exceptions" toujours coché doit être.

### Les panneaux de la devTools

A voir, [video Discover devtools](http://discover-devtools.codeschool.com/)

Sources, Resources, Network, Timeline, mobile emulation

#### Debug mobile ultime

* Weinre.. mais vieux hack
* Edge Adobe, gratuit si un seul device à la fois
* inspecteurs Chrome/Android, Safari/iOS
* Firefox Tools adapter (Firefox OS, Android, iOS) ? bientôt

### Préprocesseurs

Les transpileurs aussi

Css: Less et Sass

Mais le top : Stylus, et pour JS Coffeescript

### A quoi a-t-on droit ?

* Caniuse + Google Analytics
* html5please
* html5test
* Modernizr

Shim : essaie de fourmir l'API exacte
Polyfill : reproduit la fonctionnalité sans reproduire l'API officielle

Remplacer du svg pour les anciens navigateurs : raphaeljs

Grosse liste de polyfill sur github/Modernizr maintenue par les mecs de Modernizr

Sinon, un fallback

### Organisation du code

#### Modules

Il existe différents formats de modules

* CommonJS (Historique)
* AMD
* Harmony

Diviser pour mieux régner, namespaces, etc.

Le code devient réutilisable, on peut gérer les dépendances.

##### CommonJS

	exports.key = value
	mod = require('pathspec')

CommonJS produit un enrobage des modules. Le module c'est le nom du fichier.

CommonJS est synchrone, alors qu'AMD est asynchrone.

##### AMD

	define('name', [path, …], cb(mod, …) {})

Obligé de placer une fonction pour enrober le module avec un `define()`

##### Harmony

Version ES6, du require en natif

Implémenté sur des version nightly / aurora, en attente pour bientôt.


### Frameworks

On arrête de ré-inventer la roue.

Du MVC quoi :)

#### Backbone

Très répandu.
La couche vue dans backbone est légère  mais on peut y ajouter un moteur de tpl.
La vue dans BB c'est plutôt des expèces de contrôleurs entre le modèle et la vue.
Le routage utilise le modèle historique de HTML5 pour modifier les url sans rechargement.

### Brunch.io

Gros background, était là avant Grunt, Gulp, etc.


## Jour 3

### la webapp

App Brunch : 
1. npm install
2. npm start

Backbone : 2 notions
* Model
* Collection (collection de modèles)

REST :
* Create - POST/checkin (crée un objet + id)
* Retrieve - GET/chekin (retourne une collection)
* Retrieve - GET/checkin/id (retourne un id)
* Update - PUT/checkin/id
* Delete - DELETE/checkin/id

Backbone utilise JSON pour son adaptateur du serveur REST

## Jour 4

### Fin de la webapp

Websocket & socket.io

Appcache
chrome://appcache-internals/



### Les tests

C'est pour le bien du développeur

Demande plus de temps mais limite fortement les bugs et les regressions.

#### Test unitaire
Chaque fonction peut être testée.

Mocha: Lib de test coté nodejs, parfait pour les tests asynchrones.

avec moteur d'assertions SinonJS: Simuler, espionner, mock (bouchons), fake XHR, fake réponses serveur, ...


#### Test d'intégration/interface
Le site fonctionne t'il coté interface ?

Selenium (lance les vrais navigateurs, simule le vrai environnement utilisateur).
Karma

En JS : PhantomJS, mais plutôt SlimerJS et surtout CasperJS

Sonar: tests avec résultats qualité


### VM

[ModernIE](https://modern.ie/fr-fr/virtualization-tools#downloads)


### Documenter

[JSDoc3](http://usejsdoc.org/)

Plus sexy Docco ou Groc :

Source annotée = commentaires tradi 
Exemple : http://nevir.github.io/groc/


### mobile

Le mobile c'est top, browsers modernes, etc

UX Homogène.
Libs pour les pointers events (pointerjs)

[Meilleures pratiques W3C](http://www.w3.org/TR/mwabp/)



## Annexe

Des liens sympa, et ne pas oublier le support de formation plein de richesses

[Tout sur le cache web](https://www.mnot.net/cache_docs/)

[Groc docs](http://nevir.github.io/groc/)

[Méthode bind() #1](http://blog.overnetcity.com/2014/06/19/utilisez-methode-bind-javascript/)

[Méthode bind() #2 + Fonctions et Objets](http://www.coursweb.ch/javascript/event-instance.html)

### Outils

Backbone (+Marionette), Underscore, Brunch..

[VM modern.IE](https://modern.ie/fr-fr/virtualization-tools#downloads)














