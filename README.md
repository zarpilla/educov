# EDUCOV
Projecte desenvolupat per l'equip 070-webcoopz [webcoop](https://webcoop.cat) durant la [hackató hackovid](https://hackovid.cat/) per aportar solucions a les necessitats de la ciutadania durant el confinament.

EDUCOV és una col·lecció pública, gratuïta i oberta de continguts educatius. 

S'organitza a través de reptes que contenen els materials educatius i les referències necessaries per a aprendre online i que pots resoldre quan vulguis de manera autònoma. Aquests reptes poden tenir o no activitats d'avaluació i tu decideixes fer públics o no els teus resultats. 
Alguns reptes tenen emissions en directe a hores concretes per part de qui els planteja permetent aprofundir en temes amb l'ajuda d'un expert o de la comunitat.

![educov](https://demo.webcoop.cat/educov/educov2.png)


## Atribucions
Aquest projecte és de codi obert i ha estat desenvolupat gràcies a altres projectes de codi obert:

- [npm](https://www.npmjs.com/)
- [nodejs](https://nodejs.org/)
- [Vue](https://vuejs.org/)
- [Bulma.io](https://bulma.io/)
- [Material icons](https://material.io/resources/icons/?style=baseline)

Les imatges que conté aquest repositori tenen [llicència d'ús lliure freepik](https://www.freepik.com/)


## Frontend
Aplicació web feta amb [Vue](https://vuejs.org/)

## Backend
Per a la identificació d'usuaris i l'enmagatzematge de dades, utilitza els serveis de [Firebase](https://firebase.google.com/firebase-and-gcp)


### Get Started

``` bash
# create firebase config at ./src/firebaseSecret.js
const config = {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '' 
}

export { config }

# You will need node.js installed on your computer to run this app locally. Download it at https://nodejs.org/ if you haven't already. Follow the instructions below to get up and running.

# install dependencies
npm install

# start local server @ localhost:8080
npm run dev
```

### Tech Roadmap
- Optimitzar algunes queries
- Implementar Vue SSR via Nuxt
- Afegir mòdul PWA


### License

```
Copyright (C) 2020 webcoop

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
```
