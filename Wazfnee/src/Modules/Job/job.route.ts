import { Router } from 'express';

import { authentication, authorization } from '../../Middlewares/authentication.middleware';
import { validation } from '../../Middlewares/validation.middleware';

import { Role } from '../../Utils/enums/role.enum';
import { TokenType } from '../../Utils/enums/auth.enum';

import { JobController } from './job.controller';
import { jobValidation } from './job.validation';

const router = Router();

const jobController = new JobController();

router.post(
  '/',
  authentication({
    tokenType: TokenType.ACCESS,
  }),
  authorization({
    accessRoles: [Role.USER],
  }),
  validation(jobValidation.addJobSchema),
  jobController.addJob,
);

router.patch(
  '/:jobId',
  authentication({
    tokenType: TokenType.ACCESS,
  }),
  authorization({
    accessRoles: [Role.USER],
  }),
  validation(jobValidation.updateJobSchema),
  jobController.updateJob,
);

router.delete(
  '/:jobId',
  authentication({
    tokenType: TokenType.ACCESS,
  }),
  authorization({
    accessRoles: [Role.USER],
  }),
  validation(jobValidation.deleteJobSchema),
  jobController.deleteJob,
);

router.get(
  '/:companyId',
  authentication({
    tokenType: TokenType.ACCESS,
  }),
  authorization({
    accessRoles: [Role.USER],
  }),
  validation(jobValidation.getJobsSchema),
  jobController.getJobs,
);

router.get(
  '/:companyId/:jobId',
  authentication({
    tokenType: TokenType.ACCESS,
  }),
  authorization({
    accessRoles: [Role.USER],
  }),
  validation(jobValidation.getJobsSchema),
  jobController.getJobs,
);

router.get(
  '/',
  authentication({
    tokenType: TokenType.ACCESS,
  }),
  authorization({
    accessRoles: [Role.USER],
  }),
  validation(jobValidation.filterJobsSchema),
  jobController.filterJobs,
);

export default router;
