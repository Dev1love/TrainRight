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
exports.PlanExercise = void 0;
const typeorm_1 = require("typeorm");
const TrainingPlan_1 = require("./TrainingPlan");
const Exercise_1 = require("./Exercise");
let PlanExercise = class PlanExercise {
};
exports.PlanExercise = PlanExercise;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], PlanExercise.prototype, "plan_exercise_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => TrainingPlan_1.TrainingPlan, plan => plan.planExercises),
    __metadata("design:type", TrainingPlan_1.TrainingPlan)
], PlanExercise.prototype, "plan", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Exercise_1.Exercise),
    __metadata("design:type", Exercise_1.Exercise)
], PlanExercise.prototype, "exercise", void 0);
__decorate([
    (0, typeorm_1.Column)("int"),
    __metadata("design:type", Number)
], PlanExercise.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.Column)("int"),
    __metadata("design:type", Number)
], PlanExercise.prototype, "sets", void 0);
__decorate([
    (0, typeorm_1.Column)("int"),
    __metadata("design:type", Number)
], PlanExercise.prototype, "reps", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { nullable: true }),
    __metadata("design:type", String)
], PlanExercise.prototype, "weight_recommendation", void 0);
exports.PlanExercise = PlanExercise = __decorate([
    (0, typeorm_1.Entity)("plan_exercises")
], PlanExercise);
