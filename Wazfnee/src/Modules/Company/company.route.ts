import { Router } from 'express';

import { authentication, authorization } from '../../Middlewares/authentication.middleware';
import { validation } from '../../Middlewares/validation.middleware';

import { Role } from '../../Utils/enums/role.enum';
import { TokenType } from '../../Utils/enums/auth.enum';

import { CompanyController } from './company.controller';
import { companyValidation } from './company.validation';
import { CompanyIdDTO } from './company.dto';
import { fileValidation, localFileUpload } from '../../Utils/multer/local.multer';

const router = Router();

const companyController = new CompanyController();

router.post(
  '/',
  authentication({
    tokenType: TokenType.ACCESS,
  }),
  authorization({
    accessRoles: [Role.USER],
  }),
  validation(companyValidation.addCompanySchema),
  companyController.addCompany,
);

router.patch(
  '/:companyId',
  authentication({
    tokenType: TokenType.ACCESS,
  }),
  authorization({
    accessRoles: [Role.USER],
  }),
  validation(companyValidation.updateCompanySchema),
  companyController.updateCompany,
);

router.delete(
  '/:companyId',
  authentication({
    tokenType: TokenType.ACCESS,
  }),
  authorization({
    accessRoles: [Role.USER, Role.ADMIN],
  }),
  validation(companyValidation.companyIdSchema),
  companyController.softDeleteCompany,
);

router.get(
  '/search',
  authentication({
    tokenType: TokenType.ACCESS,
  }),
  validation(companyValidation.searchCompanySchema),
  companyController.searchCompany,
);

router.patch(
  '/:companyId/logo',
  authentication({
    tokenType: TokenType.ACCESS,
  }),
  authorization({
    accessRoles: [Role.USER],
  }),
  validation({
    params: CompanyIdDTO,
  }),
  localFileUpload({
    customPath: 'company/logo',
    validation: fileValidation.images,
    maxFileSize: 5 * 1024 * 1024,
  }).single('logo'),
  companyController.uploadCompanyLogo,
);

router.patch(
  '/:companyId/cover-pic',
  authentication({
    tokenType: TokenType.ACCESS,
  }),
  authorization({
    accessRoles: [Role.USER],
  }),
  validation({
    params: CompanyIdDTO,
  }),
  localFileUpload({
    customPath: 'company/cover',
    validation: fileValidation.images,
    maxFileSize: 5 * 1024 * 1024,
  }).single('coverPic'),
  companyController.uploadCompanyCoverPic,
);

router.delete(
  '/:companyId/logo',
  authentication({
    tokenType: TokenType.ACCESS,
  }),
  authorization({
    accessRoles: [Role.USER],
  }),
  validation({
    params: CompanyIdDTO,
  }),
  companyController.deleteCompanyLogo,
);

router.delete(
  '/:companyId/cover-pic',
  authentication({
    tokenType: TokenType.ACCESS,
  }),
  authorization({
    accessRoles: [Role.USER],
  }),
  validation({
    params: CompanyIdDTO,
  }),
  companyController.deleteCompanyCoverPic,
);

router.post(
  '/:companyId/hr',
  authentication({
    tokenType: TokenType.ACCESS,
  }),
  authorization({
    accessRoles: [Role.USER],
  }),
  validation(companyValidation.addCompanyHRSchema),
  companyController.addCompanyHR,
);

router.get(
  '/:companyId/applications/export',
  authentication({
    tokenType: TokenType.ACCESS,
  }),
  authorization({
    accessRoles: [Role.USER],
  }),
  validation(companyValidation.exportApplicationsSchema),
  companyController.exportApplications,
);

export default router;
