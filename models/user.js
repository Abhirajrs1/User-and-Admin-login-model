const mongoose = require('mongoose');
const validator = require('validator')
const userSchema = new mongoose.Schema({
    email :{
        type:String,lowercase:true,trim:true,unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is not Valid'); 
            }
        },
    }, 
    password:{
        type:String,minlength:5,maxlength:12,required:true,       
    },
    // isBlocked : {type : Boolean , default : false}
});

const User = mongoose.model('User',userSchema);


module.exports = User;