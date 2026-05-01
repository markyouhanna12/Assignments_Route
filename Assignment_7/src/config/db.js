import {Sequelize} from "sequelize";

export const sequelize = new Sequelize('blogappseq', 'root', 'root', {
  host: 'localhost',
  dialect: "mysql",
  port:3306
});

