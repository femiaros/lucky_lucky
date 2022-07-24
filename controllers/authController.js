//on the JWTs -packages needed: npm i dotenv jsonwebtoken cookie-parser
//create .env file in :root to hold ACCESS & REFRESH token
// .env file should be included in the .gitignore file

// node has a core module used to generate tokens
// run node in command line
// require('crypto').randomBytes(64).toString('hex') 
const User = require('../model/User');
const bcrypt = require('bcrypt');
//pulling in jwt tools
const jwt = require('jsonwebtoken');


const handleLogin = async (req,res) =>{
    const {user,pwd} = req.body;
        if(!user || !pwd) return res.status(400).json({'message':'usermail and password required'});
    const foundUser = await User.findOne({usermail:user}).exec();  
    if(!foundUser) return res.sendStatus(401);//Unauthorized
    //evaluate password
    const match = await bcrypt.compare(pwd,foundUser.password);
    if(match){
        const roles = Object.values(foundUser.roles);
        //create JWTs to use with route to be protected
        const accessToken = jwt.sign(
            {
                "UserInfo":{
                    "usermail": foundUser.usermail,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn:'30s'}
        );
        const refreshToken = jwt.sign(
            {"usermail": foundUser.usermail},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn:'1d'}
        );
        //save reftoken with current-user in DB, will allow us to create a log out route
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        console.log(result); 
        //http-only cookie to hold refToken *safety*
        res.cookie('jwt',refreshToken,{httpOnly:true,sameSite:'None',maxAge:24*60*60*1000});//secure:true
        //accesstoken sent to Frontend in json to be refresh a new access after interval :AT should be stored in memory in Frontend*safety*  
        res.json({accessToken});
    }else{  
        res.sendStatus(401);
    }
};

module.exports = { handleLogin };