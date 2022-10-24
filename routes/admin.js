var express = require('express');
var  router = express.Router();
var productHelpers=require('../helpers/product-helpers')
var adminHelpers=require('../helpers/admin-helpers');
const { response } = require('../app');

let sessions;

const adminVerify=(req,res,next)=>{
  sessions=req.session
  if(sessions.userId){
    next()
  }else{
    res.redirect('/admin/login')
  }
}


/* GET users listing. */

router.get('/login',(req,res)=>{
  sessions=req.session
  if(sessions.userId){
  res.redirect('/admin')
}else{
  res.render('admin/admin-login',{"loginErr":req.session.loginErr})
  req.session.loginErr=false
}
})
router.post('/login',(req,res)=>{
  adminHelpers.doAdminLogin(req.body).then((response)=>{
    if(response.status){
      sessions=req.session
      sessions.userId=req.body.username
      console.log(sessions.userId)
      console.log('hi')
      res.redirect('/admin')
    }else{
      console.log('admin login failed')
      req.session.loginErr="Invalid username or password"
      res.redirect('/admin/login')
    }
    
  })
})

router.get('/',adminVerify, function(req, res, next) {
   productHelpers.getAllProducts().then((products)=>{  ///promise
      // console.log(products);
    res.render('admin/view-products',{admin:true,products})
   })


});
router.get('/add-product',adminVerify,function(req,res){         //callback function
    res.render('admin/add-product')
})
router.post('/add-product',(req,res)=>{
  // console.log(req.body);
  // console.log(req.files.Image);
  productHelpers.addProduct(req.body,(id)=>{
    let image=req.files.Image
    image.mv('./public/product-images/'+id+'.jpg',(err,done)=>{
     if(!err){
      res.render("admin/add-product")
    }else{
      console.log(err)
    }
    })
   
  })

})
router.get('/delete-product/:id',adminVerify,(req,res)=>{
      let proId=req.params.id
      console.log(proId);
      productHelpers.deleteProduct(proId).then((response)=>{
        res.redirect('/admin/')
      })
})
router.get('/edit-product/:id',adminVerify,async(req,res)=>{
  let product=await productHelpers.getProductDetails(req.params.id)
  console.log(product);
  res.render('admin/edit-product',{product})
})
router.post('/edit-product/:id',(req,res)=>{
  let id=req.params.id
  productHelpers.updateProduct(req.params.id,req.body).then(()=>{
  res.redirect('/admin')
  if(req.files.Image){
    
    let image=req.files.Image
    image.mv('./public/product-images/'+id+'.jpg')
     }
     })
})

router.get('/logout',(req,res)=>{
  req.session.destroy();
  res.redirect("/admin/login")
})

module.exports = router;
 