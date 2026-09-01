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
const socketService = new socket_service_1.SocketService({
    corsOrigin: 'http://localhost:5173',
    authenticate: async (token) => {
        throw new Error('Socket authentication is not implemented yet');
    },
    getFriendIds: async (userId) => {
        // We will connect this to your existing User model/repository
        // in the next step.
        return [];
    },
});
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