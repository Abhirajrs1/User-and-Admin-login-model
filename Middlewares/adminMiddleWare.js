module.exports={
    isAdmin : (req,res,next)=>{
        console.log('isAdmin')
        if(req.session.isAdmin){
            next()
        }else{
            res.redirect('/admin/login')
        }
        
    },
    isLoggedIn : (req,res,next)=>{
        if(req.session.isAdmin){
            console.log('isAdmin dash')
            res.redirect('/admin/dashboard')
        }else{
            console.log(req.session?.isAdmin)
            console.log('next')
            next()
        }
    }
}