module.exports = {
    apps: [
        {
            name: 'gameplay_service',
            script: 'dist/main.js',
            node_args: '-r dotenv/config',
        },
    ],
};
