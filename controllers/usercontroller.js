const user=require('../models/userModel');
const bcrypt=require('bcrypt');

const nodemailer = require('nodemailer');

const securepassword=async(password)=>{
    try {
         const paswordhash= await bcrypt.hash(password,10);
         return paswordhash;
        
    } catch (error) {
        console.log(message.error)
        
    }
}

//for send email

const sendVerifymail = async(name,email,user_id)=>{
    try {

        const transporter = nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:'aswathirajith02@gmail.com',
                pass:'fupgoxurcftrhofp'
            }

        })
        const mailoption = {
            from:'aswathirajith02@gmail.com',
            to:email,
            subject:'for verification email',
            html:'<p>Hii '+name+',please click here to <a href="http://127.0.0.1;3000/verify?id='+user_id+'">verify </a>your mail </p>'

        }
        transporter.sendMail(mailoption,function(error,info){
            if(error)
            {
                console.log(error);
            }
            else{
                console.log("email has been sent:-",info.response);
            }

        })
        
    } catch (error) {
        console.log(error.message)
        
    }
}



const loadRegister= async(req,res)=>{
    try {
        res.render('registration');
        
    } catch (error) {
        console.log(error.message);
        
    }
}

const insertUser=async(req,res)=>{
    try {

        const spassword=await securepassword(req.body.password);
        const users=new user({
            name:req.body.name,
            email:req.body.email,
            mobile:req.body.mno,
            image:req.file.filename,
            password:spassword,
            is_admin:0
        })
        const userData=await users.save();

        if(userData)
        {
            sendVerifymail(req.body.name,req.body.email,userData._id);
            res.render('registration',{message:"Your registration has been successfull please verify your email.."})
        }
        else{
            res.render('registration',{message:"Your registration has been failed "})
        }

    } catch (error) {
        console.log(error.message)
        
    }
}


//login user
const loginLoad=async(req,res)=>{
    try {
        res.render('login')
        
    } catch (error) {
        console.log(message.error)
        
    }

}

const verifyLogin=async(req,res)=>{
    try {

        const email=req.body.email;
        const password=req.body.password;

        const userData = await user.findOne({email:email})

        if (userData) {

            const passwordMatch = await bcrypt.compare(password,userData.password);

            if(passwordMatch){
                if(userData.is_verified===0){
                    res.render('login',{message:"please verify your email"});

                }else{
                    req.session.user_id = userData._id;
                    res.redirect('/home');

                }

            }else{
                res.render('login',{message:"email and pasword is incorrect"});
            }
            
        }else{
            res.render('login',{message:"email and pasword is incorrect"});
        }
        
    } catch (error) {
        console.log(error.message);
        
    }
}

const loadHome= async(req,res)=>{
    try {
        const userData = await user.findById({_id:req.session.user_id});
        res.render('home',{user:userData});
        
    } catch (error) {
        console.log(error.message);
    }
}

const veryfyMail = async(req, res)=>{
    try {

       const updateInfo = await user.updateOne({_id:req.query.id},{ $set:{is_verified:1}})
       console.log(updateInfo);
       res.render('emailVerified');
        
    } catch (error) {
        
        console.log(error.message)
    }
}


const userLogout = async(req,res)=>{
    try {
        req.session.destroy();
        res.redirect('/');
        
    } catch (error) {
        console.log(error.message);
        
    }
}



module.exports={
    loadRegister,
    insertUser,
    loginLoad,
    verifyLogin,
    loadHome,
    veryfyMail,
    userLogout
}