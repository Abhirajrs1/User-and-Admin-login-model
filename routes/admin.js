const express = require('express');
const router = express.Router();
const AdminCollection = require('../models/admin')
const UserCollection = require('../models/user')

const adminMiddleWare = require('../Middlewares/adminMiddleWare')



router.get('/login',(req,res)=>{
    res.render('login',{isAdmin: true})
})

router.post('/login',adminMiddleWare.isLoggedIn, async (req,res)=>{
   try{
    const {email,password} = req.body

    const isAdmin = await AdminCollection.findOne({email})
    if(isAdmin && password === isAdmin.password){
        req.session.isAdmin=true
        return  res.redirect('/admin/dashboard')
    }
    
    res.render('login',{error:'no authorization',isAdmin:true})
   }
   catch(e){
    console.log(e)
   }
})

router.use(adminMiddleWare.isAdmin)

router.get('/dashboard', async (req,res)=>{
    
    try{
            const datas = await UserCollection.find({})
            res.render('admin',{datas})
        
    }
    catch(e){console.log(e)}

})

//admin update a user

router.get('/updateuser/:id', async (req,res)=>{
    req.session.updateUserId = req.params.id
    try{
    const userToUpdate = await UserCollection.findOne({_id:req.params.id})
    // rendering form to update with templates
   return res.render('edit',
    { 
        email: userToUpdate.email,
        password: userToUpdate.password
    })
    }catch(e){
        console.log(e.message)
    }
})
router.post('/update', async (req,res)=>{
    try{
        const {email, password} = req.body
        const updateUser = await UserCollection.updateOne({_id:req.session.updateUserId},
            {$set:{
                email: email,
                password:password
            }})
            console.log(updateUser)
    }
    catch(e){
        console.log(e.message)
        console.log('erroreed catched')
    }
   return res.redirect('/admin/dashboard')
   
})
// admin create user

router.get('/createUser',(req,res)=>{
    req.session.adminUserCreated = true;
    res.render('signup')
})

router.get('/deleteuser/:id',async (req,res)=>{
    const userid = req.params.id
    try{
        const deleteUser = await UserCollection.deleteOne({_id:userid})
    }catch(e){
        if(e){
            console.log(e.message)
        }else{
            console.log(`${deleteUser.name} deleted successfully`)
        }
    }
    res.redirect('/admin/dashboard')
})

router.get('/logout',(req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            console.log(err);
        }
        res.redirect('/')
    })
    
})

module.exports = router