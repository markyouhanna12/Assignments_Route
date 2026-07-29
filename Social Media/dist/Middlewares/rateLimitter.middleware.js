"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customRateLimiter = void 0;
const ipRequest = {};
const blockedIps = new Set();
const unBlockerTimers = new Map();
const RATE_LIMIT = 20;
const WINDOW_MS = 60 * 1000; // 1 minute
const customRateLimiter = (req, res, next) => {
    const ip = req.ip;
    if (!ip) {
        return next();
    }
    const currentTime = Date.now();
    if (blockedIps.has(ip)) {
        return res.status(403).json({
            message: 'Blocked IP , try again later',
        });
    }
    if (!ipRequest[ip]) {
        ipRequest[ip] = {
            count: 1,
            startTime: currentTime,
        };
        return next();
    }
    const diff = currentTime - ipRequest[ip].startTime;
    if (diff < WINDOW_MS) {
        ipRequest[ip].count++;
        if (ipRequest[ip].count > RATE_LIMIT) {
            blockedIps.add(ip);
            if (!unBlockerTimers.has(ip)) {
                const timer = setTimeout(() => {
                    blockedIps.delete(ip);
                    unBlockerTimers.delete(ip);
                }, WINDOW_MS);
                unBlockerTimers.set(ip, timer);
            }
            return res.status(429).json({
                message: 'Too many Requests , you are blocked',
            });
        }
        else {
            ipRequest[ip] = {
                count: 1,
                startTime: currentTime,
            };
        }
    }
    next();
};
exports.customRateLimiter = customRateLimiter;
//# sourceMappingURL=rateLimitter.middleware.js.map