const fs = require('fs');
const path = require('path');

const verifyConfigPath = path.join(__dirname, '../data/verifyData.json');
let verifyConfig = {
    channelId: null,
    banner: null,
    color: '#36393F', 
    title: 'Account Verification Required 🔎 ', 
    description: `To safeguard the integrity and security of our community, all new members are required to complete a verification process. This essential step helps us:

    - Prevent spam and abuse: Verification helps us identify and prevent malicious activity.
    - Maintain a welcoming environment: By verifying members, we ensure that our community is composed of genuine individuals who adhere to our guidelines.
    - Enhance security: Verification adds an extra layer of protection to our community, reducing the risk of unauthorized access.
    
    Please click the "Start Verification" button below to initiate the process.`,  
};

// Save the config to the JSON file
function saveVerifyConfig(config) {
    fs.writeFileSync(verifyConfigPath, JSON.stringify(config, null, 2));
}

// Load config from the JSON file
if (fs.existsSync(verifyConfigPath)) {
    verifyConfig = JSON.parse(fs.readFileSync(verifyConfigPath));
}

module.exports = { verifyConfig, saveVerifyConfig };
