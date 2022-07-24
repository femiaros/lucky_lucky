const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/usersController.js');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');
//use JWT for specific route
//const verifyJWT = require('../../middleware/verifyJWT'); 

router.route('/')
    //.get(verifyJWT,employeesController.getAllEmployees)
    .get(verifyRoles(ROLES_LIST.User,ROLES_LIST.Admin,ROLES_LIST.Editor),usersController.getAllUsers)
    .post(verifyRoles(ROLES_LIST.User,ROLES_LIST.Admin,ROLES_LIST.Editor),usersController.createNewUser)
    .put(verifyRoles(ROLES_LIST.User,ROLES_LIST.Admin,ROLES_LIST.Editor),usersController.updateUser)
    .delete(verifyRoles(ROLES_LIST.User,ROLES_LIST.Admin),usersController.deleteUser);

router.route('/:id')
    .get(usersController.getUser);

module.exports = router;
