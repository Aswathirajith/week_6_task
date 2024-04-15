const express = require('express');
const admin_route = express();
const session = require('express-session');
const config = require('../config/config');
const bodyParser=require('body-parser');

admin_route.use(session({secret:config.sessionSecret}));


admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({extended:true}))

admin_route.set('view engine','ejs');
admin_route.set('views','./views/admin');

const multer=require('multer');
const path=require('path');






admin_route.use(express.static('public'));


admin_route.use(session({secret:config.sessionSecret}));



const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/userimage'))

    },
    filename:function(req,file,cb){

        const name=Date.now()+'-'+file.originalname;
        cb(null,name)
    }
})

const upload=multer({storage:storage})


const auth = require('../middleware/adminAuth');

const admincontroller=require('../controllers/admincontroller');

admin_route.get('/',auth.isLogout,admincontroller.loadlogin);


admin_route.post('/',admincontroller.verifyLogin);

admin_route.get('/home',auth.isLogin,admincontroller.loadDashboard);

admin_route.get('/logout',auth.isLogin,admincontroller.logout);

admin_route.get('/dashboard',auth.isLogin,admincontroller.adminDashbard);

admin_route.get('/new-user',auth.isLogin,admincontroller.newUserload);

admin_route.post('/new-user',upload.single('image'),admincontroller.addNewuser);

admin_route.get('/edit-user',auth.isLogin,admincontroller.editUserload);

admin_route.post('/edit-user',admincontroller.updateUsers);
admin_route.get('/delete-user',admincontroller.deleteUser);

admin_route.get('*',function(req,res){
    res.redirect('/admin');
})
















module.exports = admin_route;