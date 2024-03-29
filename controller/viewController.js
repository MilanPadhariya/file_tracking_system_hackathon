const File =require('./../modal/fileModel');
const User =require('./../modal/userModel');
const Desk=require('./../modal/deskModel');
const Log=require('./../modal/logModel');

exports.getLoginPage=(req,res)=>{
    res.status(200).render('login',{
        title:'DP-Patan'
    })
};

exports.getAdminDigitalDesk=async (req,res,next)=>
{
    // console.log(req.user);
    try{
        const users=await User.find({
            onDesk:true
        }).populate('currentDesk')
        
        const files= await File.find({
            currentUserName:req.user.name,
            mode:'Digital',
            status:'In Process'
        }).populate({
            path:'previousDesk'
        });
        // console.log(files);
        res.status(200).render('adminDigitalDesk',{
            title:'Admin Dashboard DDO',
            files:files,
            users:users
        })
    }
    catch(err)
    {
        res.status(401).send(
            {
                error:err
            }
        )
    }
}

// exports.getAdminPhysicalDesk=async (req,res,next)=>
// {
//     // console.log(req.user);
//     try{
//         const files= await File.find({
//             currentUserName:req.user.name,
//             mode:'Physical',
//             status:'In Process'
//         }).populate({
//             path:'previousDesk',
//         });
//         // console.log(files);
//         res.status(200).render('adminPhysicalDesk',{
//             title:'Admin Dashboard DDO',
//             files:files
//         })
//     }
//     catch(err)
//     {
//         res.status(401).send(
//             {
//                 error:err
//             }
//         )
//     }
// }

exports.getUserDigitalDesk=async (req,res,next)=>
{
    // console.log(req.user);
    try{
        const files= await File.find({
            currentUserName:req.user.name,
            mode:'Digital',
            status:'In Process'
        }).populate({
            path:'previousDesk',
        });
        // console.log(files);
        res.status(200).render('userDigitalDesk',{
            title:'User Dashboard DDO',
            files:files
        })
    }
    catch(err)
    {
        res.status(401).send(
            {
                error:err
            }
        )
    }
}

// exports.getUserPhysicalDesk=async (req,res,next)=>
// {
//     // console.log(req.user);
//     try{
//         const files= await File.find({
//             currentUserName:req.user.name,
//             mode:'Physical',
//             status:'In Process'
//         }).populate({
//             path:'previousDesk'
//         });
//         // console.log(files);
//         res.status(200).render('userPhysicalDesk',{
//             title:'User Dashboard DDO',
//             files:files
//         })
//     }
//     catch(err)
//     {
//         res.status(401).send(
//             {
//                 error:err
//             }
//         )
//     }
// }

exports.getTrackFileDesk=async (req,res)=>{
    try{
        // // console.log("in track file View controller:------------------------------- ");
        // // console.log(req.query);
        // const queryObj={ ...req.query };
        // const excludedFields=['page','sort','limit'];
        // excludedFields.forEach(el=> delete queryObj[el]);
        
        // let queryStr=JSON.stringify(queryObj);
        // queryStr=queryStr.replace(/\b(gte|gt|lte|lt)\b/g,match=>`$${match}`);
        // // console.log(JSON.parse(queryStr));

        const query=File.find(req.query);

        const files=await query
        res.status(200).render('trackingDesk',{
            title:'Admin Dashboard DDO',
            files:files
        })
    }
    catch(err){
        res.status(401).send(
            {
                error:err
            }
        )
    }
}

exports.getCreateUserDesk=async (req,res)=>{
    try{
        const users=await User.find({
            onDesk:false
        }).populate('currentDesk');

        const desks=await Desk.find({
            userAssigned:false
        });
        // console.log(desks);
        res.status(200).render('createUserDesk',{
            title:'Admin Dashboard DDO',
            users:users,
            desks:desks
        });
    }
    catch(err){
        res.status(401).send({
            error:err
        });
    }
}

exports.getTransferDesk=async (req,res)=>{
    try{
        res.status(200).render('handleTransferDesk',{
            title:'Admin Dashboard DDO',
        });
    }
    catch(err){
        res.status(401).send({
            error:err
        });
    }
}

exports.getFileInfo=async (req,res)=>{
    try{
        const file=await File.findById(req.params.id)
        .populate({
            path:'currentDesk',
            populate:{path:'user'}
        })
        .populate({
            path:'previousDesk',
            populate:{path:'user'}
        })
        .populate({
            path:'timeline',
            populate:({
                path:'desk',
                populate:{
                    path:'user'
                }
            })
        });
        res.status(200).render('file',{
            title:'A File',
            file:file
        });
    }
    catch(err)
    {
        res.status(401).send({
            error:err
        });
    }
};

exports.getTrackFileInfo=async (req,res)=>{
    try{
        const file=await File.findById(req.params.id)
        .populate({
            path:'currentDesk',
            populate:{path:'user'}
        })
        .populate({
            path:'previousDesk',
            populate:{path:'user'}
        })
        .populate({
            path:'timeline',
            populate:({
                path:'desk',
                populate:{
                    path:'user'
                }
            })
        });
        // console.log(file);
        res.status(200).render('trackFileDetail',{
            title:'Admin Dashboard DDO',
            file:file
        });
    }
    catch(err){
        res.status(401).send({
            error:err
        });
    }
}

exports.getApplicantDesk=async(req,res,next)=>{
    try{
        // console.log(req.query.applicantMobileNumber);
        var body;
        if(req.query.applicantMobileNumber){
            body=req.query
        }
        else{
            body={applicantMobileNumber:0000000000}
        }
        // console.log(body);
        const query=File.find(body);

        const files=await query
        res.status(200).render('applicantDashboard',{
            title:'District Panchayat- Patan',
            files:files
        })
    }
    catch(err){
        res.status(401).send({
            error: err
        })
    }
}

exports.getMyFileInfo=async (req,res)=>{
    try{
        const file=await File.findById(req.params.id)
        .populate({
            path:'currentDesk',
            populate:{path:'user'}
        })
        .populate({
            path:'previousDesk',
            populate:{path:'user'}
        })
        .populate({
            path:'timeline',
            populate:({
                path:'desk',
                populate:{
                    path:'user'
                }
            })
        });
        // console.log(file);
        res.status(200).render('applicantFileDetail',{
            title:'Applicant DDO-Patan',
            file:file
        });
    }
    catch(err){
        res.status(401).send({
            error:err
        });
    }
}

exports.getAdminLogDesk=async(req,res)=>{
    try{
        var theMonth;
        if(req.query.month){
            theMonth=req.query.month;
        }
        else{
            theMonth=0;
        }

        const logs= await Log.find({$expr:{$eq:[{$month:'$time'},`${theMonth}`]},userId:`${req.user.id}`}).populate('fileId');

        res.status(200).render('adminLogDesk',{
            title:'District Panchayat- Patan',
            logs:logs
        })

    }
    catch(err){
        res.status(401).send({
            status:"error in rendering pages",
            error:err
        });
    }
}

exports.getUserLogDesk=async(req,res)=>{
    try{
        var theMonth;
        if(req.query.month){
            theMonth=req.query.month;
        }
        else{
            theMonth=0;
        }

        const logs= await Log.find({$expr:{$eq:[{$month:'$time'},`${theMonth}`]},userId:`${req.user.id}`}).populate('fileId');

        res.status(200).render('userLogDesk',{
            title:'District Panchayat- Patan',
            logs:logs
        })

    }
    catch(err){
        res.status(401).send({
            status:"error in rendering pages",
            error:err
        });
    }
}