var express = require('express');
var router = express.Router();
var productHelpers=require('../helpers/product-helpers')
const userHelper=require('../helpers/user-helper')
const verifyLogin=(req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }else{
    res.redirect('/login')
  }
}
  
/* GET home page. */
router.get('/', function(req, res, next) {
  let user=req.session.user
  console.log(user);
  productHelpers.getAllProducts().then((products)=>{  ///promise
    // console.log(products);
  res.render('users/view-products',{products,user})
 })
});

router.get('/login',(req,res)=>{
  if(req.session.loggedIn){
    res.redirect('/')
  }else{
  res.render('users/login',{"loginErr":req.session.loginErr})
  req.session.loginErr=false
  }
})
router.post('/login',(req,res)=>{
  userHelper.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.loggedIn=true
      req.session.user=response.user 
        res.redirect('/')
     }else{ 
      req.session.loginErr="Invalid username or password"
        res.redirect('/login')
     }
  })
})
router.get('/signup',(req,res)=>{
  if(req.session.loggedIn)
  res.redirect('/')
  else
  res.render('users/signup')
})

router.post('/signup',(req,res)=>{
    userHelper.doSignup(req.body).then((response)=>{
        // console.log(req.body);
        // req.session.loggedIn=true
        // req.session.user=response
        res.redirect('/login')
    })

})

router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/login')
})


module.exports = router;