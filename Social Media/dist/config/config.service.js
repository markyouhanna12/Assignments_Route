"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WHITE_LIST = exports.REFRESH_EXPIRES = exports.ACCESS_EXPIRES = exports.TOKEN_REFRESH_ADMIN_SECRET_KEY = exports.TOKEN_ACCESS_ADMIN_SECRET_KEY = exports.TOKEN_REFRESH_USER_SECRET_KEY = exports.TOKEN_ACCESS_USER_SECRET_KEY = exports.ENCRYPTION_SECRET_KEY = exports.SALT = exports.dbUrl = exports.PORT = void 0;
const path_1 = require("path");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({
    path: (0, path_1.resolve)('./config/dev.env'),
});
const requiredEnv = (key) => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing environment variable: ${key}`);
    }
    return value;
};
exports.PORT = requiredEnv('PORT');
exports.dbUrl = requiredEnv('DB_URL');
exports.SALT = requiredEnv('SALT');
exports.ENCRYPTION_SECRET_KEY = requiredEnv('ENCRYPTION_SECRET_KEY');
exports.TOKEN_ACCESS_USER_SECRET_KEY = requiredEnv('TOKEN_ACCESS_USER_SECRET_KEY');
exports.TOKEN_REFRESH_USER_SECRET_KEY = requiredEnv('TOKEN_REFRESH_USER_SECRET_KEY');
exports.TOKEN_ACCESS_ADMIN_SECRET_KEY = requiredEnv('TOKEN_ACCESS_ADMIN_SECRET_KEY');
exports.TOKEN_REFRESH_ADMIN_SECRET_KEY = requiredEnv('TOKEN_REFRESH_ADMIN_SECRET_KEY');
exports.ACCESS_EXPIRES = requiredEnv('ACCESS_EXPIRES');
exports.REFRESH_EXPIRES = requiredEnv('REFRESH_EXPIRES');
// WHITE_LIST for cors
exports.WHITE_LIST = requiredEnv('WHITE_LIST');
//# sourceMappingURL=config.service.js.map