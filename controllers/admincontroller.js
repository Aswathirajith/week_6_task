const user=require('../models/userModel');
const bcrypt=require('bcrypt');
var randomstring = require("randomstring");
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

const addUsermail = async(name,email,password,user_id)=>{
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
            subject:'admin add you and verify your email',
            html:'<p>Hii '+name+',please click here to <a href="http://127.0.0.1;3000/verify?id='+user_id+'">verify </a>your mail </p> <br> <b>Email:-</b>'+email+'<br><b>password:-</b>'+password+''

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


const loadlogin = async(req,res)=>{
    try {
        res.render('login');
        
    } catch (error) {
        console.log(error.message)
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
                if(userData.is_admin===0){
                    res.render('login',{message:"email and pasword is incorrect"});

                }else{
                    req.session.user_id = userData._id;
                    res.redirect('/admin/home');

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


const loadDashboard = async(req,res)=>{
    try {
        const userData = await user.findById({_id:req.session.user_id});
        res.render('home',{admin:userData});
        
    } catch (error) {
        console.log(error.message)
    }
}

const logout = async(req,res)=>{
    try {

        req.session.destroy();
        res.redirect('/admin');
        
    } catch (error) {
        console.log(error.message)
        
    }
}


const adminDashbard = async(req,res)=>{
    try {

       const userData = await user.find({is_admin:0});
        res.render('dashboard',{users:userData})
        
    } catch (error) {
        console.log(error.message);
    }
}

const newUserload= async(req,res)=>{
    try {
        res.render('new-user');
        
    } catch (error) {
        console.log(error.message);
    }
}


const addNewuser = async(req,res)=>{
    try {
        const name = req.body.name;
        const email = req.body.email;
        const mno = req.body.mno;
        const image = req.file.filename;
        const password = randomstring.generate(8)
         
        const spassword = await securepassword(password)

        const users = new user({
            name:name,
            email:email,
            mobile:mno,
            image:image,
            password:spassword,
            is_admin:0

        })

        const userData = await users.save();

        if(userData){
            addUsermail(name,email,password,userData._id);
            res.redirect('/admin/dashboard');
        }else{
            res.render('new-user',{message:"something wrong"});
        }
        
    } catch (error) {
        console.log(error.message);
    }
}

const editUserload= async(req,res)=>{
    try {
        const id= req.query.id;
        const userData = await user.findById({_id:id})
        if(userData){
            res.render('edit-user',{user:userData});
        }
        else{
            res.redirect('/admin/dashboard');
        }
        
        
    } catch (error) {
        console.log(error.message);
    }
}

const updateUsers = async(req,res)=>{
    try {
        const userData = await user.findByIdAndUpdate({_id:req.body.id},{$set:{name:req.body.name,email:req.body.email,mobile:req.body.mno,is_verified:req.body.verify}});
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.log(error.message);
    }
}

const deleteUser = async(req,res)=>{
    try {

        const id= req.query.id;
        await user.deleteOne({_id:id});
        res.redirect('/admin/dashboard');
        
    } catch (error) {
        console.log(error.message);
    }
}

module.exports ={
    loadlogin,
    verifyLogin,
    loadDashboard,
    logout,
    adminDashbard,
    newUserload,
    addNewuser,
    editUserload,
    updateUsers,
    deleteUser 
}