const express=require('express');
const user_route=express();
const bodyParser=require('body-parser');
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended:true}))
const multer=require('multer');
const path=require('path');
const session = require('express-session');



const config = require('../config/config');

user_route.use(express.static('public'));


user_route.use(session({secret:config.sessionSecret}));

const auth = require('../middleware/auth');

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

user_route.set('view engine','ejs');
user_route.set('views','./views/users');

const usercontroller=require('../controllers/usercontroller');

user_route.get('/register',auth.isLogout,usercontroller.loadRegister);

user_route.post('/register',upload.single('image'),usercontroller.insertUser);

user_route.get('/',auth.isLogout,usercontroller.loginLoad);
user_route.get('/login',auth.isLogout,usercontroller.loginLoad);
user_route.post('/login',usercontroller.verifyLogin);
user_route.get('/home',auth.isLogin,usercontroller.loadHome);
user_route.get('/verify',usercontroller.veryfyMail);
user_route.get('/logout',auth.isLogin,usercontroller.userLogout);



module.exports=user_route;