import { NextFunction, Request, Response } from 'express';
import { CompanyService } from './company.service';
import { successResponse } from '../../Utils/response/success.response';

export class CompanyController {
  private readonly _companyService = new CompanyService();

  addCompany = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this._companyService.addCompany(req.user._id.toString(), req.body);

      successResponse({
        res,
        statusCode: 201,
        message: 'Company created successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  updateCompany = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this._companyService.updateCompany(
        req.user._id.toString(),
        req.params['companyId'] as string,
        req.body,
      );

      successResponse({
        res,
        statusCode: 200,
        message: 'Company updated successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  softDeleteCompany = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this._companyService.softDeleteCompany(
        req.params['companyId'] as string,
        req.user._id.toString(),
        req.user.role,
      );

      successResponse({
        res,
        statusCode: 200,
        message: 'Company deleted successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  searchCompany = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this._companyService.searchCompany(req.query['name'] as string);

      successResponse({
        res,
        statusCode: 200,
        message: 'Companies found successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  };
}
