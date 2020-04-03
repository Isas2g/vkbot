let TOKEN = '7790cfc632531699e19c06b42f747c03eb66c7442ab6a8f86884cf27104281c987ef5de7888a47b6345e4';
let BOT_ID = 'isas2g';
let MESSAGES = ['Очень приятно видеть это в своей ленте', 'Как красиво', 'Да, я это всегда хотел увидеть', 'чем я занимаюсь'];
let MILLISECONDS = 900000; // обновление новостей в миллисекундах
let PORT = process.env.PORT || 3000;

let usersToLike = 'k1pse, isas2g, ed9app, id224715702, phoboscat';

module.exports = {
    TOKEN,
    MESSAGES,
    MILLISECONDS,
    PORT,
    BOT_ID,
    usersToLike
};
