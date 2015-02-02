var targetModules = [
    {
        path: './src/db/db-utils.js',
        exposes: {
            init: 'init'
        }},
     {
        path: './src/core/archiver.js',
        exposes: {
            self: 'self'
        }},
];

exports.targetModules = targetModules;