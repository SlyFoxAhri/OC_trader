// database/seeders/demo-data.js
const sequelize = require('../../config/database');
const { Role, User, Character } = require('../../models/index');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
    try {
        console.log('Seeding sample data...');

        // 1. Seed Roles
        const adminRole = await Role.create({ name: 'admin' });
        const userRole = await Role.create({ name: 'user' });

        // 2. Hash Passwords
        const hashedAdminPassword = await bcrypt.hash('admin123', 10);
        const hashedUser1Password = await bcrypt.hash('user123', 10);
        const hashedUser2Password = await bcrypt.hash('user456', 10);

        // 3. Seed Users
        const adminUser = await User.create({
            email: 'admin@ochub.com',
            passwordHash: hashedAdminPassword,
            roleId: adminRole.id
        });

        const regularUser1 = await User.create({
            email: 'alice@ochub.com',
            passwordHash: hashedUser1Password,
            roleId: userRole.id
        });

        const regularUser2 = await User.create({
            email: 'bob@ochub.com',
            passwordHash: hashedUser2Password,
            roleId: userRole.id
        });

        // 4. Seed Characters (OCs)
        await Character.create({
            name: 'Shadow Weaver',
            age: 114,
            gender: 'Non-binary',
            likes: 'Dark chocolate, ancient artifacts, quiet libraries',
            dislikes: 'Bright flashlights, loud noises',
            description: 'An ancient elf mage wandering around neon cityscapes.',
            visibility: 'public',
            userId: regularUser1.id
        });

        await Character.create({
            name: 'Sparky',
            age: 19,
            gender: 'Male',
            likes: 'Skateboards, energy drinks, EDM music',
            dislikes: 'Rainy days, math homework',
            description: 'An energetic punk cyber-cyborg with lightning powers.',
            visibility: 'public',
            userId: regularUser2.id
        });

        await Character.create({
            name: 'Secret Agent X',
            age: 32,
            gender: 'Female',
            likes: 'Espresso, classified files',
            dislikes: 'Betrayal',
            description: 'Top-secret private original character. Should not show up on public feeds.',
            visibility: 'private',
            userId: regularUser1.id
        });

        console.log('Seeding complete! Test accounts ready:');
        console.log('Admin: admin@ochub.com (admin123)');
        console.log('User 1: alice@ochub.com (user123)');
        console.log('User 2: bob@ochub.com (user456)');

    } catch (error) {
        console.error('Error seeding database:', error);
    }
}

if (require.main === module) {
    seedDatabase();
}

module.exports = seedDatabase;