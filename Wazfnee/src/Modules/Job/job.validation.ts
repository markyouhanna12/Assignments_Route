import { AddJobDTO, JobIdDTO, UpdateJobDTO } from './job.dto';

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
};
