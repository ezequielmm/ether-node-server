jest.mock('src/main', () => {
    return {
        getApp: () => undefined,
    };
});
