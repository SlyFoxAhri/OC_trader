const { Trade, Character, sequelize } = require('../models/index');

exports.proposeTrade = async (senderId, data) => {
    const { senderCharacterId, receiverCharacterId } = data;

    const offeredChar = await Character.findByPk(senderCharacterId);
    if (!offeredChar || offeredChar.userId !== senderId) {
        throw new Error('MUST_OWN_OFFERED_CHARACTER');
    }

    const requestedChar = await Character.findByPk(receiverCharacterId);
    if (!requestedChar) {
        throw new Error('REQUESTED_CHARACTER_NOT_FOUND');
    }
    if (requestedChar.visibility !== 'public') {
        throw new Error('CANNOT_TRADE_PRIVATE_CHARACTER');
    }

    if (requestedChar.userId === senderId) {
        throw new Error('CANNOT_TRADE_WITH_SELF');
    }

    return await Trade.create({
        senderId,
        receiverId: requestedChar.userId,
        senderCharacterId,
        receiverCharacterId,
        status: 'pending'
    });
};

exports.getUserTrades = async (userId) => {
    return await Trade.findAll({
        where: {
            [sequelize.Sequelize.Op.or]: [{ senderId: userId }, { receiverId: userId }]
        },
        include: [
            { model: Character, as: 'offeredCharacter', attributes: ['id', 'name'] },
            { model: Character, as: 'requestedCharacter', attributes: ['id', 'name'] }
        ]
    });
};

exports.respondToTrade = async (tradeId, receiverId, responseStatus) => {
    const trade = await Trade.findByPk(tradeId);
    if (!trade) throw new Error('TRADE_NOT_FOUND');

    if (trade.receiverId !== receiverId) throw new Error('UNAUTHORIZED_ACTION');

    if (trade.status !== 'pending') throw new Error('TRADE_ALREADY_PROCESSED');

    if (responseStatus === 'rejected') {
        await trade.update({ status: 'rejected' });
        return { message: 'Trade request rejected successfully. :/ ', trade };
    }

    if (responseStatus === 'accepted') {
        const charA = await Character.findByPk(trade.senderCharacterId);
        const charB = await Character.findByPk(trade.receiverCharacterId);

        if (!charA || !charB) throw new Error('CHARACTERS_MISSING');
        if (charA.userId !== trade.senderId || charB.userId !== trade.receiverId) {
            throw new Error('OWNERSHIP_CHANGED_BEFORE_ACCEPTANCE');
        }

        await sequelize.transaction(async (t) => {
            await charA.update({ userId: trade.receiverId }, { transaction: t });
            await charB.update({ userId: trade.senderId }, { transaction: t });

            await trade.update({ status: 'accepted' }, { transaction: t });

            await Trade.update(
                { status: 'canceled' },
                {
                    where: {
                        status: 'pending',
                        id: { [sequelize.Sequelize.Op.ne]: trade.id },
                        [sequelize.Sequelize.Op.or]: [
                            { senderCharacterId: trade.senderCharacterId },
                            { receiverCharacterId: trade.senderCharacterId },
                            { senderCharacterId: trade.receiverCharacterId },
                            { receiverCharacterId: trade.receiverCharacterId }
                        ]
                    },
                    transaction: t
                }
            );
        });

        return { message: 'Trade successful! Your OCs have been safely swapped! :3', trade };
    }

    throw new Error('INVALID_RESPONSE_ACTION');
};