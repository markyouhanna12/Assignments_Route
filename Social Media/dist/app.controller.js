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
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)(cors_utils_1.corsOptions));
app.use((0, helmet_1.default)());
app.use(rateLimitter_middleware_1.customRateLimiter);
exports.default = app;
//# sourceMappingURL=app.controller.js.map