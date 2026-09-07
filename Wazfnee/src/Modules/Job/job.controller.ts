import { NextFunction, Request, Response } from 'express';
import { JobService } from './job.service';
import { successResponse } from '../../Utils/response/success.response';
import { GetJobsQueryDTO } from './job.dto';

export class JobController {
  private readonly _jobService = new JobService();

  addJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this._jobService.addJob(req.user._id.toString(), req.body);

      successResponse({
        res,
        statusCode: 201,
        message: 'Job created successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  updateJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this._jobService.updateJob(
        req.user._id.toString(),
        req.params['jobId'] as string,
        req.body,
      );
      successResponse({
        res,
        statusCode: 200,
        message: 'Job updated successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this._jobService.deleteJob(
        req.user._id.toString(),
        req.params['jobId'] as string,
      );

      successResponse({
        res,
        statusCode: 200,
        message: 'Job deleted successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  getJobs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this._jobService.getJobs(
        req.params['companyId'] as string,
        req.params['jobId'] as string,
        req.query as unknown as GetJobsQueryDTO,
      );

      successResponse({
        res,
        statusCode: 200,
        message: 'Jobs retrieved successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  };
}
