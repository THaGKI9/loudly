var config = {}


config.development = {
    'allowAnonymous': true,
    'admin': null,
    'database': {
        'driver': 'sqlite',
        'filename': './content/db/loudly-dev.db'
    }
};


config.production = {
    'allowAnonymous': true,
    'admin': {
        'user': 'loudly',
        'password': 'admin',
    },
    'database': {
        'driver': 'sqlite',
        'filename': './content/db/loudly-prod.db'
    }
};


config.test = {
    'allowAnonymous': true,
    'admin': {
        'user': 'loudly',
        'password': 'test'
    },
    'database': {
        'driver': 'sqlite',
        'filename': './content/db/loudly-test.db'
    }
};

module.exports = config;
