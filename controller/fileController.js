const File = require('./../modal/fileModel');
const User =require('./../modal/userModel');
const Timeline =require('./../modal/timelineModel');

exports.addNewFile = async (req, res) => {
    try {
        const user=await User.findById(req.body.userId).populate({
            path:'currentDesk'
        });

        var creationDate=new Date();

        var expDate =req.body.expectedDate.split('-');
        var mydate = new Date(expDate[0], expDate[1] - 1, expDate[2]); 

        var currentDate=new Date();
        
        // calculating delayed--------------------
        var delayed;
        if(currentDate>mydate)
        {
            delayed=true;
        }
        else{
            delayed=false;
        }
        // ------------------------------------------------------------------

        var data={
            subject:req.body.subject,
            currentDesk:user.currentDesk,
            previousDesk:user.currentDesk,
            mode:req.body.mode,
            creationDate:creationDate,
            expectedDate:mydate,
            delayed:delayed,
            applicantDetails:{
                name:req.body.applicantName,
                mobileNumber:req.body.applicantMobileNumber,
                email:req.body.applicantEmailId
            },
            dateOfLastForward:currentDate
        }

        // ------------------------------------------------------------------
        const newFile = await File.create(data);
        res.status(201);
        res.json(
            {
                status: "new File creted",
                data:
                {
                    newFile
                }
            }
        )
    }
    catch (err) {
        console.log(err);
        res.json(
            {
                status: "fail",
                erroe: (err)
            }
        )
    }
}

exports.updateTimeTaken=async(req,res,next)=>{
     // calculating timetaken------------------
     var date1 = currentDate;
     var date2 = creationDate;

     // To calculate the time difference of two dates
     var Difference_In_Time = date2.getTime() - date1.getTime();

     // To calculate the no. of days between two dates
     var timeTaken = Difference_In_Time / (1000 * 3600 * 24);
     // ---------------------------------------
    
}

exports.getAllFiles = async (req, res) => {
    const docs = await File.find().populate('currentDesk').populate('previousDesk').populate('timeline');
    try {
        res.status(200)
            .json(
                {
                    NoOfResults: docs.length,
                    data: {
                        docs
                    }
                }
            )
    }
    catch (error) {
        res.json(error)
    }
}

exports.getOneFile = async (req, res) => {
    try {
        let query = File.findById(req.params.id).populate('currentDesk').populate('previousDesk').populate('timeline');
        const doc = await query;
        if (doc) {
            return res.status(200)
                .json(
                    {
                        data: doc
                    }
                )
        }
        else {
            return res.status(200)
                .json(
                    {
                        detail: "no document with this id found"
                    }
                )
        }

    }
    catch (error) {
        return res.status(400)
            .json(
                {
                    error: error
                }
            )
    }
}

exports.addExistingFile=async(req,res)=>{
    try{

    }
    catch(err){

    }
}

exports.sendFile=async(req,res)=>{
    try{
        // console.log("in send file controller");

        // 1. check if file exist or not
    
            let query = File.findById(req.params.id)
            const fileInfo = await query;
            if (!fileInfo) {
                res.status(401).json({
                    error:"no file found of this ID"
                })
            }

        // 2. Get desk data from the user

        const user1=await User.findById(req.body.userId).populate({
            path:'currentDesk'
        });
        
        const user2=await User.findById(req.body.nextUserId).populate({
            path:'currentDesk'
        })
        var previousDesk=user1.currentDesk;
        var nextDesk=user2.currentDesk;

        var fileToBeUpdated=req.params.id;

        var currentDate= new Date();

        //  3. add timeline
        var data={
            fileId:req.params.id,
            status:req.body.status,
            remarks:req.body.remarks,
            desk:previousDesk,
            dateOfReceiving:fileInfo.dateOfLastForward,
            dateOfForwarding:currentDate
        }
        const newTimeline = await Timeline.create(data);
        fileInfo.timeline.push(newTimeline.id);
        var updatedTimeline=fileInfo.timeline;

         // 4. update the file data
        var updatingData={
            currentDesk:user2.currentDesk,
            previousDesk:user1.currentDesk,
            dateOfLastForward:currentDate,
            timeline:updatedTimeline
        }

        const doc = await File.findByIdAndUpdate(req.params.id, updatingData, {
            new: true,
            runValidators: true
          });
        if(doc){
            res.status(200).json({
                message:"file sent",
                file:doc
            })
        }
    }
    catch(err){
        res.status(400).json({
            message:err
        })
    }
}