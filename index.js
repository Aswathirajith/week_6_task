const mongoose=require('mongoose');
mongoose.connect( "mongodb://127.0.0.1:27017/user_management_system");

const express=require('express');
const app=express();


//for user
const userRoute=require("./routers/userRoute");
app.use('/',userRoute);


//for admin
const adminRoute=require("./routers/adminRoute");
app.use('/admin',adminRoute);

app.listen(3000,function(){
    console.log("server started....")
})
