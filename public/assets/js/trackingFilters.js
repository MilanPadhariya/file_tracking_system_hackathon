const passId=async (fileId)=>{
    if(!fileId){
        alert('enter file ID please');
    }
    else{
        location.assign(`/trackFile/${fileId}`);
    }
}

const queryFilter=async(office,department)=>{
    if(office!='NA' && department==='NA'){
        location.assign(`/adminDashboard/trackFiles/?currentOffice=${office}`);
    }
    if(department!='NA' && office==='NA'){
        location.assign(`/adminDashboard/trackFiles/?currentBranch=${department}`);
    }
    if(office!='NA' && department!='NA'){
        location.assign(`/adminDashboard/trackFiles/?currentBranch=${department}&currentOffice=${office}`);
    }
    if(office==='NA' && department==='NA'){
        alert(`please select office or branch and then submit`);
    }
}

document.querySelector('.removeFilters').addEventListener('submit',e=>{
    e.preventDefault();
    location.assign('/adminDashboard/trackFIles');
})

document.querySelector('.trackFileFilters').addEventListener('submit',e=>{
    e.preventDefault();
    const office=document.getElementById('officeFilter').value;
    const department=document.getElementById('deptFilter').value;
    queryFilter(office,department);
})

document.querySelector('.trackByIdForm').addEventListener('submit',e=>{
    e.preventDefault();
    const fileId=document.getElementById('idBox').value;
    passId(fileId);
})