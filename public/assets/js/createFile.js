const createNewDigitalFile=async(fileSubject,expectedDate,applicantName,applicantMobileNumber,applicantEmailId)=>{
    try{
        // alert("in createNewFIle.js")
        // alert(fileSubject)
        const res = await axios ({
            method: 'POST',
            url: '/api/files/addNewFile',
            data:{
                subject:fileSubject,
                mode:'Digital',
                expectedDate:expectedDate,
                applicantName:applicantName,
                applicantMobileNumber:applicantMobileNumber,
                applicantEmailId:applicantEmailId
            }
        });
        // console.log(res.data.data.newFile._id);
        if(res.data.status==='new File created'){
            alert(`new file created with id- ${res.data.data.newFile._id} `); 
        }
        else{
            alert("error in adding file");
        }
    }
    catch(err){
        alert("error in adding the file");
    }
}

document.querySelector('.addNewDigitalFileForm').addEventListener('submit',e=>{
    e.preventDefault();
    const fileSubject=document.getElementById('fileSubject').value;
    const expectedDate=document.getElementById('fileExpectedDate').value;
    const applicantName=document.getElementById('applicantName').value;
    const applicantMobileNumber=document.getElementById('applicantMobileNumber').value;
    const applicantEmailId=document.getElementById('applicantEmailId').value;
    createNewDigitalFile(fileSubject,expectedDate,applicantName,applicantMobileNumber,applicantEmailId);
})
