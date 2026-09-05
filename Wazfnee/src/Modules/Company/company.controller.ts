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
}
