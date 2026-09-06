import { NextFunction, Request, Response } from 'express';
import { CompanyService } from './company.service';

export class CompanyController {
  private readonly _companyService = new CompanyService();

  addCompany = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this._companyService.addCompany(req.user._id.toString(), req.body);

      res.status(201).json({
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
      res.status(200).json({
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

      res.status(200).json({
        message: 'Company deleted successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  };
}
