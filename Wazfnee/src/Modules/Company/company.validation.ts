import { AddCompanyDTO, CompanyIdDTO, SearchCompanyDTO, UpdateCompanyDTO } from './company.dto';

export const companyValidation = {
  addCompanySchema: {
    body: AddCompanyDTO,
  },
  updateCompanySchema: {
    params: CompanyIdDTO,
    body: UpdateCompanyDTO,
  },
  companyIdSchema: {
    params: CompanyIdDTO,
  },
  searchCompanySchema: {
    query: SearchCompanyDTO,
  },
};
