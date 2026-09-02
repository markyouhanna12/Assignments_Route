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
const user_controller_1 = __importDefault(require("./Modules/User/user.controller"));
const post_controller_1 = __importDefault(require("./Modules/Post/post.controller"));
const redis_connection_1 = require("./DB/redis.connection");
const notification_service_1 = require("./Utils/services/notification.service");
const notification_config_1 = require("./Utils/services/notification.config");
const chat_routes_1 = __importDefault(require("./Modules/Chat/chat.routes"));
const app = (0, express_1.default)();
(0, connection_1.default)();
(0, redis_connection_1.redisConnection)();
(0, notification_config_1.initializeFirebase)();
const notificationService = new notification_service_1.NotificationService();
app.use(express_1.default.json());
app.use((0, cors_1.default)(cors_utils_1.corsOptions));
app.use((0, helmet_1.default)());
app.use(rateLimitter_middleware_1.customRateLimiter);
app.use('/api/v1/auth', auth_controller_1.default);
app.use('/api/v1/user', user_controller_1.default);
app.use('/api/v1/post', post_controller_1.default);
app.use('/api/v1/chat', chat_routes_1.default);
app.post('/send-notification', async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'FCM token is required',
            });
        }
        await notificationService.sendNotification({
            token,
            data: {
                title: 'Hello from Social Media App 👋',
                body: 'This notification was sent successfully!',
            },
        });
        return res.status(200).json({
            success: true,
            message: 'Notification sent successfully',
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to send notification',
            error: error instanceof Error ? error.message : error,
        });
    }
});
app.use(error_response_1.globalErrorHandler);
app.use('/*dummy', (req, res) => {
    throw new error_response_1.NotFoundException('Not Found Handler!');
});
exports.default = app;
//# sourceMappingURL=app.controller.js.map