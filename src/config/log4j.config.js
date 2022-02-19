const path = require('path'); 

module.exports = {
    filename: `${path.join(__dirname, '../../logs/')}server.log`,
    level: "info"
}