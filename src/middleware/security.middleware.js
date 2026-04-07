
import aj from '#config/arcjet.js';
import logger from '#config/logger.js';
import { slidingWindow } from '@arcjet/node';
const securityMiddleware = (req, res, next) => {
    try {
        const role = req.user?.role || 'guest'; 
        let limit;
        let message;
        switch (role) {
            case 'admin':
                limit=20
                message = 'Admin request limit exceeed(20 per minute). Slow down';
                break;
            case 'user':
                limit=10
                message = 'User request limit exceeed(10 per minute). Slow down';
                break;
            case 'guest':
                limit=5
                message = 'Guest request limit exceeed(5 per minute). Slow down'
                break;
        }
        
        const client = aj.withRule(slidingWindow({mode: 'LIVE', interval: '1m',max:limit, name: `${role}_rate_limit`}));
        const decision = client.evaluate(req);
        if(decision.isDenied() && decision.reason.isBot()){
            logger.warn('Bot request blocked', { ip: req.ip, path: req.path, userAgent: req.get('user-agent') });
            return res.status(403).json({ error: 'Forbidden', message: 'Bot requests are not allowed' });
        }

        if(decision.isDenied() && decision.reason.isShield()){
            logger.warn('Shield block request', { ip: req.ip, path: req.path, userAgent: req.get('user-agent') });
            return res.status(403).json({ error: 'Forbidden', message: 'Request blocked by shield' });
        }

        if(decision.isDenied() && decision.reason.isRateLimit()){
            logger.warn('Rate limit exceeded', { ip: req.ip, path: req.path, userAgent: req.get('user-agent') });
            return res.status(403).json({ error: 'Forbidden', message: 'Rate limit exceeded' });
        }

        req.rateLimit = { limit, message };
        next();
    } catch (error) {
        console.error('Arcjet middleware error', error);
        res.status(500).json({ error: 'Internal Server Error', message: "Something went wrong with security middleware"});
    }
};

export default securityMiddleware;