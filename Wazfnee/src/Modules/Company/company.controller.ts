import { NextFunction, Request, Response } from 'express';
import { CompanyService } from './company.service';
import { successResponse } from '../../Utils/response/success.response';
import { BadRequestException } from '../../Utils/response/error.response';

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

  uploadCompanyLogo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.file) {
        throw new BadRequestException('Company logo is required');
      }

      const data = await this._companyService.uploadCompanyLogo(
        req.user._id.toString(),
        req.params['companyId'] as string,
        req.file,
      );
      successResponse({
        res,
        statusCode: 200,
        message: 'Company logo uploaded successfully',
        data: {
          logo: data,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  uploadCompanyCoverPic = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.file) {
        throw new BadRequestException('Company cover picture is required');
      }

      const data = await this._companyService.uploadCompanyCoverPic(
        req.user._id.toString(),
        req.params['companyId'] as string,
        req.file,
      );

      successResponse({
        res,
        statusCode: 200,
        message: 'Company cover picture uploaded successfully',
        data: {
          coverPic: data,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  deleteCompanyLogo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this._companyService.deleteCompanyLogo(
        req.user._id.toString(),
        req.params['companyId'] as string,
      );

      successResponse({
        res,
        statusCode: 200,
        message: 'Company logo deleted successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteCompanyCoverPic = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const data = await this._companyService.deleteCompanyCoverPic(
        req.user._id.toString(),
        req.params['companyId'] as string,
      );

      successResponse({
        res,
        statusCode: 200,
        message: 'Company cover picture deleted successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  addCompanyHR = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this._companyService.addCompanyHR(
        req.user._id.toString(),
        req.params['companyId'] as string,
        req.body.userId,
      );

      successResponse({
        res,
        statusCode: 200,
        message: 'HR added to company successfully',
        data: {
          userId: data._id,
          username: data.username,
          email: data.email,
        },
      });
    } catch (error) {
      next(error);
    }
  };
  exportApplications = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { companyId } = req.params;
      const { date } = req.query;

      const { buffer, filename } = await this._companyService.exportApplications({
        companyId: companyId as string,
        userId: req.user._id.toString(),
        date: date as string,
      });
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

      res.send(buffer);
    } catch (error) {
      next(error);
    }
  };
}
