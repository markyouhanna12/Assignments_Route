"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const http_1 = require("http");
const config_service_1 = require("./config/config.service");
const app_controller_1 = __importDefault(require("./app.controller"));
const socket_service_1 = require("./Utils/socket/socket.service");
const httpServer = (0, http_1.createServer)(app_controller_1.default);
const socketService = new socket_service_1.SocketService();
socketService.initialize(httpServer);
const startServer = async () => {
    try {
        httpServer.listen(config_service_1.PORT, () => {
            console.log(chalk_1.default.bold.blue(`HTTP server running on port ${config_service_1.PORT}`));
        });
    }
    catch (error) {
        console.log(chalk_1.default.red(String(error)));
    }
};
startServer();
//# sourceMappingURL=server.js.map