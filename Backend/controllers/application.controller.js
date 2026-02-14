import Application from "../models/application.model.js";
import Job from "../models/job.model.js";



export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;
    if (!jobId) {
      return res.status(400).json({
        message: "Job ID is required",
        success: false,
      });
    }
    // Check if the user has already applied for the job
    const existingApplication = await Application.findOne({
      applicant: userId,
      job: jobId,
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job",
        success: false,
      });
    }

    // check if the job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }
    
    // create a new application
    const newApplication = new Application({
      applicant: userId,
      job: jobId,
    });

    job.applications.push(newApplication._id);
    await job.save();
    return res.status(200).json({   
        message: "Job applied successfully",  
        success: true,
        application: newApplication,
    });

  } catch (error) {
    console.log(error);
  }
};

export const getAppliedJobs= async (req, res) => {
  try {
    const userId = req.id;
    const applications = (await Application.find({ applicant: userId })).toSorted({createdAt: -1}).populate({
        path: 'job',
        options:{ sort: { createdAt: -1 }},
        populate: {
            path: 'company',
            options:{ sort: { createdAt: -1 }},
        }
    });
    if (!applications) {
      return res.status(404).json({
        message: "No applications found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Applied jobs retrieved successfully",
      success: true,
      applications,
    });
  }catch(error){
console.log(error);
  }
};


// admin can see all the applicants for a job
export const getApplicants = async (req, res) => {
    try{
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path: 'applications',
            options:{ sort: { createdAt: -1 }},
            populate: {
                path: 'applicant'}
        });
        if(!job){
            return res.status(404).json({
                message: "Job not found",
                success: false,
            });
        }
        return res.status(200).json({
            message: "Applicants retrieved successfully",
            success: true,
            applicants: job.applications,
        });
    }catch(error){
        console.log(error);
    }

}

export const updateStatus = async (req, res) => {
    try{
        const {status} = req.body;
        const applicationId = req.params.id;
       if(!status){
        return res.status(400).json({
            message: "Status is required",
            success: false,
        });
       };

       //FIND THE APPLICATION BY APPLICANTION ID
       const application = await Application.findOne({_id: applicationId});
       if(!application){ 
        return res.status(404).json({
            message: "Application not found",
            success: false,
        });
       };

       //UPDATE THE STATUS OF THE APPLICATION
         application.status = status.toLowerCase();

         await application.save();

         return res.status(200).json({
            message: "Status updated successfully",
            success: true,
            application,
        });

    }catch(error){
        console.log(error);
    }
}

