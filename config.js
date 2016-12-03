let config = {};
module.exports = config;

config.development = {
    allowAnonymous: true,
    admin: null,
    database: './content/db/loudly-dev.sqlite',
    databaseDebug: true
};


config.production = {
    allowAnonymous: true,
    admin: {
        user: 'loudly',
        password: 'admin',
    },
    database: './content/db/loudly-prod.sqlite',
    databaseDebug: false
};


config.test = {
    allowAnonymous: true,
    admin: {
        user: 'loudly',
        password: 'admin',
    },
    database: './content/db/loudly-test.sqlite',
    databaseDebug: false
};
