// database/migrate.js
const sequelize = require('../config/database');
const { bcrypt } = require('bcryptjs'); 
// We import models to ensure everything drops and syncs in perfect dependency order
require('../models/index');

async function runMigrations() {
    try {
        console.log('🔄 Drop old tables if they exist and running migrations...');
        // force: true drops existing tables to keep your system tests pure on run
        await sequelize.sync({ force: true });
        console.log('✅ Database schemas instantiated successfully!');
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    runMigrations();
}

module.exports = runMigrations;