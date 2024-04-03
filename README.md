# Backend service
- Prerequisite
  + Node v18+
  + Mysql 5.7+
- Install packages:
  `yarn`
- Build:
  `yarn build`
- Startup:
  `yarn start`
- Create database:
  `npx sequelize-cli db:create`
- Generate new migration:
  `npx sequelize-cli migration:create --name [name]`
- Run migration:
  `npx sequelize-cli db:migrate`
- Run seeder:
  `npx sequelize-cli db:seed:all`


