import { DataTypes , Model } from "sequelize";
import {sequelize} from "../config/db.js"


export class Post extends Model {}

Post.init({
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    title:{
        type:DataTypes.STRING,
        allowNull:false
    },
    content:{
        type:DataTypes.TEXT,
        allowNull:false,
    },
    userId:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
},{
    sequelize,
    modelName:"Post",
    timestamps:true,
    paranoid:true
})

