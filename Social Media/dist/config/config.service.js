"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WHITE_LIST = exports.dbUrl = exports.PORT = void 0;
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
// WHITE_LIST for cors
exports.WHITE_LIST = requiredEnv('WHITE_LIST');
//# sourceMappingURL=config.service.js.map