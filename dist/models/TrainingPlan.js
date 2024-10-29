"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainingPlan = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const PlanExercise_1 = require("./PlanExercise");
let TrainingPlan = class TrainingPlan {
};
exports.TrainingPlan = TrainingPlan;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], TrainingPlan.prototype, "plan_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User),
    __metadata("design:type", User_1.User)
], TrainingPlan.prototype, "trainer", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TrainingPlan.prototype, "plan_name", void 0);
__decorate([
    (0, typeorm_1.Column)("text"),
    __metadata("design:type", String)
], TrainingPlan.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => PlanExercise_1.PlanExercise, planExercise => planExercise.plan),
    __metadata("design:type", Array)
], TrainingPlan.prototype, "planExercises", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], TrainingPlan.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], TrainingPlan.prototype, "updated_at", void 0);
exports.TrainingPlan = TrainingPlan = __decorate([
    (0, typeorm_1.Entity)("training_plans")
], TrainingPlan);
