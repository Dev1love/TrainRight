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
exports.WorkoutProgress = void 0;
const typeorm_1 = require("typeorm");
const ClientWorkout_1 = require("./ClientWorkout");
const Exercise_1 = require("./Exercise");
let WorkoutProgress = class WorkoutProgress {
};
exports.WorkoutProgress = WorkoutProgress;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], WorkoutProgress.prototype, "progress_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ClientWorkout_1.ClientWorkout),
    __metadata("design:type", ClientWorkout_1.ClientWorkout)
], WorkoutProgress.prototype, "workout", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Exercise_1.Exercise),
    __metadata("design:type", Exercise_1.Exercise)
], WorkoutProgress.prototype, "exercise", void 0);
__decorate([
    (0, typeorm_1.Column)("int"),
    __metadata("design:type", Number)
], WorkoutProgress.prototype, "set_number", void 0);
__decorate([
    (0, typeorm_1.Column)("float", { nullable: true }),
    __metadata("design:type", Number)
], WorkoutProgress.prototype, "weight", void 0);
__decorate([
    (0, typeorm_1.Column)("int"),
    __metadata("design:type", Number)
], WorkoutProgress.prototype, "reps", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], WorkoutProgress.prototype, "completed_at", void 0);
exports.WorkoutProgress = WorkoutProgress = __decorate([
    (0, typeorm_1.Entity)("workout_progress")
], WorkoutProgress);
