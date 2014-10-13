var targetModules = [
    {
        path: './db/db-utils.js',
        exposes: {
            init: 'init'
        }},
     {
        path: './core/mover.js',
        exposes: {
            self: 'self'
        }},
];

exports.targetModules = targetModules;