const User = require('../model/User');
const bcrypt = require('bcrypt');

async function getAllUsers(req,res){
    const users = await User.find();
    if(!users) return res.status(204).json({'message':'No users found'});
    res.json(users);
};

const createNewUser = async (req,res,)=>{
    if(!req?.body?.user || !req?.body?.pwd){
        return res.status(400).json({"message": "email and password required."})
    };
    const {user,pwd} = req.body;
    //if foundUser email already exists in DB
    const duplicate = await User.findOne({usermail:user}).exec();  
    if(duplicate) return res.sendStatus(409);//conflict

    try{
        //encrypt the passwd
        const hashedPwd = await bcrypt.hash(pwd,10);
        const result = await User.create({
            usermail: user,
            password: hashedPwd,
            "firstname":'',
            "lastname":''
        });
        console.log(result);
        res.status(201).json(result);
    }catch (error) {
        //status(500) - server error: error.message to the error string
        res.status(500).json({'message': error.message})
    }
    
        
   
};

async function updateUser(req,res){
    if(!req?.body?.id){
        return res.status(400).json({"message":` ID not issued`});
    }
    //find in db foundUser with that id
    const foundUser = await User.findOne({_id: req.body.id}).exec();
    const {user,pwd,firstname,lastname} = req.body;
    
    if(!foundUser){
        return res.status(204).json({"message":` No User matches: ID ${req.body.id}`});
    }
    try {
        if(req.body?.foundUser) foundUser.usermail = user? user : foundUser.usermail;
        if(req.body?.pwd) foundUser.password = pwd ? await bcrypt.hash(pwd,10) : foundUser.password;
        if(req.body?.firstname) foundUser.firstname = firstname? firstname : foundUser.firstname;
        if(req.body?.lastname) foundUser.lastname = lastname? lastname: foundUser.lastname;
        const result = await foundUser.save();
        console.log(result);
        res.json(result);
    } catch (error) {
        res.status(500).json({'message': error.message})
    }
};

async function deleteUser(req,res){
    if(!req?.body?.id){
        return res.status(400).json({"message":` ID not issued`});
    }
    const foundUser = await User.findOne({_id: req.body.id}).exec();
    if(!foundUser){
        return res.status(204).json({"message":` No User matches: ID ${req.body.id}`});
    }
    const result = await foundUser.deleteOne({_id: req.body.id});
    console.log(result);
    res.json(result);
};

async function getUser(req,res){
    if(!req?.params?.id){
        return res.status(400).json({"message":` foundUser ID required`});
    }
    const foundUser = await User.findOne({_id: req.params.id}).exec();
    if(!foundUser){
        return res.status(204).json({"message":` No User matches: ID ${req.params.id}`});
    }
    res.json(foundUser);
};

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser,
    getUser
}