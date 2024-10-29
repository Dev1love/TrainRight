"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRoutes = void 0;
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/users', auth_1.authenticate, (0, auth_1.authorize)(['admin']), (req, res) => {
    res.json({ message: 'Admin route' });
});
exports.adminRoutes = router;
