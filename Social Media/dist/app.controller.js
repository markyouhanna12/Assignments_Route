"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cors_utils_1 = require("./Utils/cors/cors.utils");
const rateLimitter_middleware_1 = require("./Middlewares/rateLimitter.middleware");
const error_response_1 = require("./Utils/response/error.response");
const connection_1 = __importDefault(require("./DB/connection"));
const auth_controller_1 = __importDefault(require("./Modules/Auth/auth.controller"));
const app = (0, express_1.default)();
(0, connection_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)(cors_utils_1.corsOptions));
app.use((0, helmet_1.default)());
app.use(rateLimitter_middleware_1.customRateLimiter);
app.use('/api/auth', auth_controller_1.default);
app.use(error_response_1.globalErrorHandler);
app.use('/*dummy', (req, res) => {
    throw new error_response_1.NotFoundException('Not Found Handler!');
});
exports.default = app;
//# sourceMappingURL=app.controller.js.map