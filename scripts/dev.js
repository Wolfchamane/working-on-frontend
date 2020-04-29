if (!process.env.NODE_ENV || !['dev'].includes(process.env.NODE_ENV))
{
    process.env.NODE_ENV = 'dev';
}

require('@amjs/vue-tools/scripts/server');
