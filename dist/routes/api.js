"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userRoutes_1 = require("./userRoutes");
const planRoutes_1 = require("./planRoutes");
const workoutRoutes_1 = require("./workoutRoutes");
const trainerClientRoutes_1 = require("./trainerClientRoutes");
const adminRoutes_1 = require("./adminRoutes");
const router = (0, express_1.Router)();
// Public routes
router.use('/users', userRoutes_1.userRoutes);
// Protected routes
router.use('/plans', planRoutes_1.planRoutes);
router.use('/workouts', workoutRoutes_1.workoutRoutes);
router.use('/trainer-client', trainerClientRoutes_1.trainerClientRoutes);
// Admin routes
router.use('/admin', adminRoutes_1.adminRoutes);
exports.default = router;
