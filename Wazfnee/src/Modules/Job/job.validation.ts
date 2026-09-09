import {
  AddJobDTO,
  ApplicationIdDTO,
  FilterJobsDTO,
  GetJobApplicationsDTO,
  GetJobsParamsDTO,
  GetJobsQueryDTO,
  JobIdDTO,
  UpdateApplicationStatusDTO,
  UpdateJobDTO,
} from './job.dto';

export const jobValidation = {
  addJobSchema: {
    body: AddJobDTO,
  },

  updateJobSchema: {
    params: JobIdDTO,
    body: UpdateJobDTO,
  },
  deleteJobSchema: {
    params: JobIdDTO,
  },
  getJobsSchema: {
    params: GetJobsParamsDTO,
    query: GetJobsQueryDTO,
  },
  filterJobsSchema: {
    query: FilterJobsDTO,
  },
  getJobApplicationsSchema: {
    params: JobIdDTO,
    query: GetJobApplicationsDTO,
  },
  applyToJobSchema: {
    params: JobIdDTO,
  },
  updateApplicationStatusSchema: {
    params: ApplicationIdDTO,
    body: UpdateApplicationStatusDTO,
  },
};
