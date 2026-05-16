// models/index.js
const sequelize = require('../config/database');
const { DataTypes, Model } = require('sequelize');

// Define Model Classes
class Role extends Model {}
class User extends Model {}
class Picture extends Model {}
class Character extends Model {}
class Trade extends Model {}

// Initialize Models
Role.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true }
}, { sequelize, modelName: 'Role', tableName: 'roles', timestamps: false });

User.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
    roleId: { type: DataTypes.INTEGER, allowNull: false }
}, { sequelize, modelName: 'User', tableName: 'users' });

Picture.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    originalName: { type: DataTypes.STRING, allowNull: false },
    storedName: { type: DataTypes.STRING, allowNull: false, unique: true },
    mimeType: { type: DataTypes.STRING, allowNull: false },
    size: { type: DataTypes.INTEGER, allowNull: false },
    uploadDate: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    characterId: { type: DataTypes.INTEGER, allowNull: false }
}, { sequelize, modelName: 'Picture', tableName: 'pictures', timestamps: false });

Character.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    age: { type: DataTypes.INTEGER, allowNull: true },
    gender: { type: DataTypes.STRING, allowNull: true },
    likes: { type: DataTypes.TEXT, allowNull: true },
    dislikes: { type: DataTypes.TEXT, allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    visibility: { 
        type: DataTypes.ENUM('public', 'private'), 
        allowNull: false, 
        defaultValue: 'public' 
    },
    userId: { type: DataTypes.INTEGER, allowNull: false }
}, { sequelize, modelName: 'Character', tableName: 'characters' });

Trade.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    senderId: { type: DataTypes.INTEGER, allowNull: false },
    receiverId: { type: DataTypes.INTEGER, allowNull: false },
    senderCharacterId: { type: DataTypes.INTEGER, allowNull: false },
    receiverCharacterId: { type: DataTypes.INTEGER, allowNull: false },
    status: { 
        type: DataTypes.ENUM('pending', 'accepted', 'rejected', 'canceled'), 
        allowNull: false, 
        defaultValue: 'pending' 
    }
}, { sequelize, modelName: 'Trade', tableName: 'trades' });

// ==========================================
// Define Associations (Relationships)
// ==========================================

// User <-> Role (Many-to-One)
Role.hasMany(User, { foreignKey: 'roleId' });
User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });

// User <-> Character (One-to-Many)
User.hasMany(Character, { foreignKey: 'userId', as: 'characters' });
Character.belongsTo(User, { foreignKey: 'userId', as: 'owner' });

// Character <-> Picture (One-to-Many)
Character.hasMany(Picture, { foreignKey: 'characterId', as: 'pictures', onDelete: 'CASCADE' });
Picture.belongsTo(Character, { foreignKey: 'characterId', as: 'character' });

// Trades Associations
User.hasMany(Trade, { foreignKey: 'senderId', as: 'sentTrades' });
User.hasMany(Trade, { foreignKey: 'receiverId', as: 'receivedTrades' });
Trade.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Trade.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });

Character.belongsTo(Trade, { foreignKey: 'senderCharacterId', as: 'offeredCharacter' });
Character.belongsTo(Trade, { foreignKey: 'receiverCharacterId', as: 'requestedCharacter' });

module.exports = { sequelize, Role, User, Picture, Character, Trade };