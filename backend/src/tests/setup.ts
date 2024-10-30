import { MockUserRepository } from './mocks/MockUserRepository';

let userRepository: MockUserRepository;

beforeAll(() => {
    userRepository = new MockUserRepository();
});

beforeEach(() => {
    userRepository.clear();
});

export { userRepository }; 