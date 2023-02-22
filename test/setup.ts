import 'reflect-metadata';

jest.mock('src/main', () => {
    return {
        getApp: () => undefined,
    };
});
