export interface FormData {
  // Company data
  responsibleName: string;
  companyName: string;
  segment: string;
  cpfCnpj: string;
  email: string;
  phone: string;
  
  // Agreement data
  services: string[];
  contractModel: 'monthly' | 'single' | '';
  // Values for monthly model
  setupValue: string;
  monthlyValue: string;
  // Value for single model
  singleValue: string;
  paymentMethods: string[];
  recurringReminder: boolean | null;
  
  // Assistant data
  mainFunctions: string[];
  top5Questions: string;
  communicationTone: string;
  
  // Digital presence
  contactPhones: string;
  paymentMethodsAccepted: string;
  address: string;
  instagram: string;
  website: string;
  restrictedTopics: string;
  
  // Materials
  additionalInfo: string;
  uploadedFiles: File[];
}

export const initialFormData: FormData = {
  responsibleName: '',
  companyName: '',
  segment: '',
  cpfCnpj: '',
  email: '',
  phone: '',
  services: [],
  contractModel: '',
  setupValue: '',
  monthlyValue: '',
  singleValue: '',
  paymentMethods: [],
  recurringReminder: null,
  mainFunctions: [],
  top5Questions: '',
  communicationTone: '',
  contactPhones: '',
  paymentMethodsAccepted: '',
  address: '',
  instagram: '',
  website: '',
  restrictedTopics: '',
  additionalInfo: '',
  uploadedFiles: [],
};

export type QuizStep = 
  | 'loading'
  | 'welcome'
  | 'company'
  | 'personalization'
  | 'digital'
  | 'materials'
  | 'success';

export const STEP_PROGRESS: Record<QuizStep, number> = {
  loading: 0,
  welcome: 0,
  company: 33,
  personalization: 66,
  digital: 100,
  materials: 100,
  success: 100,
};
