var targetModules = [
    {
        path: './src/db/db-utils.js',
        exposes: {
            init: 'init'
        }},
     {
        path: './src/core/mover.js',
        exposes: {
            self: 'self'
        }},
];

exports.targetModules = targetModules;