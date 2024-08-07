<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Challenge DJOB

Bonjour !
Ceci est mon premier projet utilisant Nest.
J'espère ne pas m'être trop mal débrouillé !

- [x] Un client (Customer) a la possibilité d'effectuer des locations (Rental) de films.

  ```js
  POST {{endpoint}}/rental
  Content-Type: application/json
  {
  "title": "ACADEMY TEST",
  "rental_id": 1,
  "rental_date": "2005-05-24T22:53:30.000Z",
  "inventory_id": 365,
  "customer_id": 131,
  "return_date": "2006-05-26T22:04:30.000Z",
  "staff_id": 1
  }
  ```

- [x] Chaque location est représentée par une date de début et une date de retour, qui peuvent être choisies par le client.
- [x] La durée d'une location est d'au minimum 1 semaine et ne doit pas excéder 3 semaines.

  ```md
  Une validation a été rajouté dans le fichier rental.service.ts
  Une migration a été mise en place afin d'ajouter une vérification pour toutes les nouvelles locations
  ```

- [x] Les dates de début et de retour des locations sont définies en fonction du fuseau horaire (timezone) du client (les tables doivent être modifiées en conséquence).

```md
Lors de la création d'un nouveau customer il doit choisir un fuseau horaire qui sera enregistré dans une nouvelle colonne de la table customer (par défaut ce sera Paris).
Cette valeur sera utilisé pour créer les réservations et enregistré dans la bdd
```

- [ ] Une location en cours n'est pas modifiable.

- [x] Installer la base de données "Sakila" en version PostgreSQL disponible sur ce lien : https://github.com/jOOQ/sakila/tree/main/postgres-sakila-db (installer schéma + données).
- [x] Initialiser un projet NestJS avec les entités Customer, Film et Rental (en utilisant TypeORM ou Prisma).
- [x] Deux tâches planifiées doivent être mises en place :
  - Une tâche planifiée qui envoie un email à J-5 à 12h00 avant la date de retour de chaque location.
  - Une tâche planifiée qui envoie un email à J-3 à 12h00 avant la date de retour de chaque location.
- [x] Créer une API permettant de : - Ajouter/Modifier un client. - Effectuer une location. - Lister toutes les tâches planifiées. - Lancer une tâche planifiée manuellement. - Vérifier l'état d'exécution d'une tâche planifiée.

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
