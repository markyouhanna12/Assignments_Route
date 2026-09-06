import { Router } from 'express';

import { authentication, authorization } from '../../Middlewares/authentication.middleware';
import { validation } from '../../Middlewares/validation.middleware';

import { Role } from '../../Utils/enums/role.enum';
import { TokenType } from '../../Utils/enums/auth.enum';

import { CompanyController } from './company.controller';
import { companyValidation } from './company.validation';
import { CompanyIdDTO } from './company.dto';

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

export default router;
