"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const http_1 = require("http");
const config_service_1 = require("./config/config.service");
const app_controller_1 = __importDefault(require("./app.controller"));
const socket_io_1 = require("socket.io");
const httpServer = (0, http_1.createServer)(app_controller_1.default);
const startServer = async () => {
    try {
        httpServer.listen(config_service_1.PORT, () => {
            console.log(chalk_1.default.bold.blue(`HTTP server running on port ${config_service_1.PORT}`));
        });
        const io = new socket_io_1.Server(httpServer, {
            cors: {
                origin: '*',
            },
        });
        io.on('connection', (socket) => {
            console.log(socket.id);
            socket.on('disconnect', () => {
                console.log(`Logout from ${socket.id}`);
            });
        });
    }
    catch (error) {
        console.log(chalk_1.default.red(String(error)));
    }
};
startServer();
//# sourceMappingURL=server.js.map