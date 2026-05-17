
const sequelize = require('../config/database');
const { bcrypt } = require('bcryptjs'); 

require('../models/index');

async function runMigrations() {
    try {
        console.log('Migration started ...');
        await sequelize.sync({ force: true });
        console.log('Migration done :3');
    } catch (error) {
        console.error('No migration :c', error);
        process.exit(1);
    }
}

if (require.main === module) {
    runMigrations();
}

module.exports = runMigrations;