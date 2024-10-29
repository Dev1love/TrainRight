"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = void 0;
const MockUserRepository_1 = require("./mocks/MockUserRepository");
let userRepository;
beforeAll(() => {
    exports.userRepository = userRepository = new MockUserRepository_1.MockUserRepository();
});
beforeEach(() => {
    userRepository.clear();
});
