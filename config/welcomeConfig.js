const fs = require('fs');
const path = require('path');

// Load the config
let welcomeConfig = require('../data/welcomeData.json'); 

// Function to save the config back to the file
const saveConfig = () => {
    fs.writeFileSync(path.join(__dirname, 'welcomeData.json'), JSON.stringify(welcomeConfig, null, 2));
};

// Export the config and the save function
module.exports = {
    welcomeConfig,
    saveConfig,
};
