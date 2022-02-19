const express = require('express');
const router = new express.Router();
const { hbsProperties } = require('../config/app.config');
const log4js = require('../services/log4j');
let logger = log4js.getLogger("chat  ");

// --- Chat pages ---
router.get('', (req, res) => {  
    logger.info(`access to 'main' page`);
    res.render('join', { ...hbsProperties, title: 'Chat-App', })
});  

router.get('/chat', (req, res) => {  
    logger.info(`access to 'main' page`);
    res.render('chat', { ...hbsProperties, title: 'Chat-App', })
});  

router.get('/about', (req, res) => {
    logger.info(`access to 'about' page`);
    res.render('about', { ...hbsProperties, title: 'About Me' });
}); 

router.get('/help', (req, res) => {
    logger.info(`access to 'help' page`);
    res.render('help', { ...hbsProperties, title: 'Help', message: 'Chat with your friends'})
})

module.exports = router;