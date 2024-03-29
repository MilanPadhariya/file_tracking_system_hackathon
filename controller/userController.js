const Log=require('./../modal/logModel');
const User=require('./../modal/userModel');
const Desk=require('./../modal/deskModel');
const jwt = require('jsonwebtoken');


exports.Login = async (req,res,next) => {
try {
    // console.log('req.body');
    const {email,password,role} = req.body
    if(!email || !password ){
        res.status(200).json({
            status:"fail",
            messege : "Provide both Email and Password"
        })
        return next();
    }
    const isuser = await User.findOne({email})
    // console.log(isuser.id);
    // console.log(isuser);
    if(isuser.onDesk===false){
        res.status(200).json({
            status:"fail",
            messege:"You are no more on the Desk"
        })
        return next();
    }

    // const userpassword =  isuser.password
    if(!isuser || (password!=isuser.password)){
        res.status(200).json({
            status:"fail",
            messege:"user and password does not match"
        })
        return next();
    }

    if(isuser.role != role){
            res.status(200).json(
            {
                status:"fail",
                messege:"incorrect role"
            }
        )
        return next();
    }
 
    const token = jwt.sign({ id:isuser._id },process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES
      })
      const cookieOptions = {
        expiresIn : new Date(Date.now()+ process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 *60 * 1000),
        httpOnly:true
      }
      res.cookie('jwt', token, cookieOptions);
      res.status(201).json({
        status: 'success',
        token,
        data: {
          isuser
        }
      })
 next()

} catch (error) {
    res.status(400).json({
        status:"Failed",
        err:error
    })
}

}
exports.isLoggedIn = async (req, res, next) => {
  
    if(req.cookies.jwt){
    //    console.log("hey");
      try {
        const decoded =  jwt.verify(
          req.cookies.jwt,
          process.env.JWT_SECRET
        );
  
        const currentUser = await User.findById(decoded.id);
      
        if (!currentUser) {
          return next();
        }
  
        res.locals.user = currentUser;
        req.user=currentUser;
        return next();
      }
       catch (err) {
        return next();
      }
    
    }
    else{
        res.json({
            error:"please Logging"
        })
    }
    
  };


exports.createNewUser=async (req,res)=>
{
    try{
        const newUser= await User.create(req.body);
        res.status(201);
        res.json(
            {
                status:"new user creted",
                data:
                {
                    newUser
                }
            }
        )
    }
    catch(err)
    {
        console.log(err);
        res.json(
            {
                status:"fail",
                erroe:(err)
            }
        )
    }
}

exports.assignDesk=async(req,res,next)=>{
    try{
        // console.log("in user controller")
        // console.log(req.params.name);
        // console.log(req.body);
        var user=await User.find({name:req.body.user});
        const desk=await Desk.find({designation:req.params.name});
        var userId=user[0].id;
        var deskId=desk[0].id;

        var body={currentDesk:`${deskId}`,onDesk:true};
        // var userId=user[0].id;
        // var deskId=desk[0].id;
        // // console.log(userId);
        // console.log('in userControl userId up and deskId down');
        // console.log(deskId);
        const doc= await User.findByIdAndUpdate(userId,body,
            {
                new:true,
                runValidators:true
            });
            next();
        res.status(200).json({
            status:"Success",
            data:doc
        })
    }
    catch(error)
    {
        res.status(400).json({
            status:"fail",
            error:error
        })
    } 
}

exports.getAllUsers=async(req,res)=> 
{
    const docs=await User.find().populate({
        path:'currentDesk'
    });
    try{
        res.status(200)
        .json(
            {
                NoOfResults:docs.length,
                data:{
                    docs
                }
            }
        )
    }
    catch(error)
    {
        res.json(error)
    }
}

exports.updateUser = async(req,res,next)=>{
    var currentUser = req.body.currentUserId;
    var newUser = req.body.newUserId;
    var desk = req.body.deskId;

    var cuser =await User.findByIdAndUpdate(currentUser,{currentDesk :null,onDesk:false},{
        new:true,
        runValidators:true
    })

    if(!cuser) res.status(400).json({messege:"Current User does not exist,Please Provide a registred User id"})
    var nuser =await User.findByIdAndUpdate(newUser,{currentDesk:desk, onDesk:true},{
        new:true,
        runValidators:true
    })
    
    if(!nuser) res.status(400).json({messege:"New User does not exist,Please Provide a registred User id"})
    res.status(200).json({
        status:"Success"
    })
}

exports.getMyLogs=async(req,res)=>{
    try{
        const logs=await Log.find({$expr:{$eq:[{$month:'$time'},`${req.query.month}`]},userId:`${req.body.userId}`});
        // console.log(logs.length);
        res.status(200).json({
            status:'Success',
            logs:logs,
            length:logs.length
        });
    }
    catch(err){
        res.status(400).json({
            status:"fail"
        })
    }
    // console.log(req.query.month);
    // console.log(logs);
}