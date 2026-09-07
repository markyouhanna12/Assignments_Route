import {
  AddJobDTO,
  FilterJobsDTO,
  GetJobsParamsDTO,
  GetJobsQueryDTO,
  JobIdDTO,
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
};
