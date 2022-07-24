const User = require('../model/User');

const handleLogout = async(req,res) =>{
    // On client, also delete the accessToken in memory of client app
    const cookies = req.cookies;
    if(!cookies?.jwt) return res.sendStatus(204);//success-no content 
    const refreshToken = cookies.jwt;

    // checking for refreshToken in DB
    const foundUser = await User.findOne({refreshToken}).exec();  
    // If cookie came back but not matched user in DB 
    if(!foundUser){
        //clear the cookie
        res.clearCookie('jwt',{httpOnly:true});
        return res.sendStatus(204);//success-no content 
    } 
    
    // We did find refreshToken match in DB, Now delete from DB 
    foundUser.refreshToken = '';
    const result = await foundUser.save();
    console.log(result);
    // deleted from DB, now clear cookie
    res.clearCookie('jwt',{httpOnly:true,sameSite:'None',secure:true}); //secure:true - only serves to http(s-secure), to be added in production,production doesnt need to be secured
    res.sendStatus(204)//no-content to send back
};

module.exports = {handleLogout};