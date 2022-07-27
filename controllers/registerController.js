//:npm i bcrypt - needed to encrypt passwd received from user req sent with reg route
const User = require('../model/User');
const bcrypt = require('bcrypt');

//handler for newuser received for the register router 
const handleNewUser = async (req,res)=>{
    console.log(req.body);
    const {user,pwd,phone,firstName,lastName} = req.body;
        if(!user || !pwd || !phone) return res.status(400).json({'message':'usermail, password and phone are required'});
        //CHECK FOR DUPLICATE USERNAMES IN THE DB
        const duplicate = await User.findOne({usermail:user}).exec();  
        if(duplicate) return res.sendStatus(409);//conflict
    try {
        //encrypt the passwd
        const hashedPwd = await bcrypt.hash(pwd,10);

        //create and store the new user in DB :mongo give us the power together with .create
        const result = await User.create({
            "usermail":user, 
            "phone":phone, 
            "password":hashedPwd,
            "firstname":firstName,
            "lastname":lastName
            //role already defualted in schema
            // Obj-ID is auto craeted in DB
        });
        console.log(result);
        res.status(201).json({'success':`New user with email: ${user} created!`})
    } catch (error) {
        //status(500) - server error: error.message to the error string
        res.status(500).json({'message': error.message})
    }
};

module.exports = { handleNewUser };