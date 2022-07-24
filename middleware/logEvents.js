//npm install nodemon -g    (to always auto start the server//its install globally-terminal)
//:nodenom -to start a globally installed nodenom :nodemon filename -this also works
//commands to run running scripts is disable on system error
//: set-ExecutionPolicy RemoteSigned -Scope CurrentUser
//: Get-ExecutionPolicy
//: Get-ExecutionPolicy -list

//to use npm packages, we initialise npm for our project: npm init -y(installs direct,says yes to all question)
//npm init (installs normally)
//always create a .gitignore file in proj folder(to help ignore heavy file sent when publishing work),put inside: node_modules
//hence if you need clone another repository,wont run without the node_modules folder,hence you need install back the required modules from npm: npm install
//npm i date-fns (date function package from npm;this is a production pkage so no flag.this appears under dependencies{})
//install package as dev dependent e.g with nodemon: npm i nodemon -D
//take note of your scripts,thats what server will use to run yr if hosted somewhere
//start should be entry point: "start": "node index" 
//dev dependent pkage should be listed here too: "dev": "nodemon index"
//after proj completion,to start the proj: npm start
//whats listed in dev-dependent are *required* by a proj,hence to run the dev packages will still working: npm run dev
//install a production dependent pkage like date-fns, no need to put flag to install: npm i uuid
//install specific version: uuid@8.3.2 
// check for installed pkages updates: npm update
//un-install pkage, a dependent flag must be attached e.g: npm rm nodemon -D (this takes it out of devdependcs{}, so remove from script yrself  )
 
const {format} = require('date-fns');
const {v4: uuid} = require('uuid');
const fs = require('fs');
const fsPromises = require('fs').promises; 
const path = require('path'); 

async function logEvents(message,fileName){
    const dateTime = `${format(new Date(),'yyyyMMdd\tHHmmss')}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
    //console.log(logItem)
    try {
        if(!fs.existsSync(path.join(__dirname,'..','logs'))){
            await fsPromises.mkdir(path.join(__dirname,'..','logs'));
        }
        await fsPromises.appendFile(path.join(__dirname,'..','logs',fileName), logItem);      
    } catch (error) {
        console.log(error)
    }
}

function logger(req,res, next){
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`,'reqLog.txt');
    //console.log(`${req.method} ${req.path}`)
    next()
};
module.exports = {logger,logEvents};
