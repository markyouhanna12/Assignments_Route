import { AddCompanyDTO, CompanyIdDTO, UpdateCompanyDTO } from './company.dto';

export const companyValidation = {
  addCompanySchema: {
    body: AddCompanyDTO,
  },
  updateCompanySchema: {
    params: CompanyIdDTO,
    body: UpdateCompanyDTO,
  },
};
