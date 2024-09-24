const express = require('express');
const axios = require('axios');
const winston = require('winston');
require('winston-daily-rotate-file');

const app = express();
const PORT = 3000;

const transport = new winston.transports.DailyRotateFile({
    filename: 'logs/application-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '1d',
    maxSize: '20m',
    zippedArchive: false
});

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`)
    ),
    transports: [transport]
});

const fetchDataFromApi = async () => {
    try {
        const response = await axios.get('https://forest-talk-api.onrender.com');
        logger.info('Данные успешно получены: ' + JSON.stringify(response.data));
    } catch (error) {
        logger.error('Ошибка при запросе к API: ' + error.message);
    }

    const randomInterval = Math.floor(Math.random() * (180000 - 30000 + 1)) + 30000;
    logger.info(`Следующий запрос через ${randomInterval / 1000} секунд`);

    setTimeout(fetchDataFromApi, randomInterval);
};

fetchDataFromApi();

app.listen(PORT, () => {
    logger.info(`Приложение запущено на порту ${PORT}`);
});
