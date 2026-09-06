import { AddJobDTO } from './job.dto';

export const jobValidation = {
  addJobSchema: {
    body: AddJobDTO,
  },
};
