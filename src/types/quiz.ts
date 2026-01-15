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
  agreedValue: string;
  valueNotes: string;
  paymentMethods: string[];
  recurringReminder: boolean | null;
  
  // Assistant data
  mainFunctions: string[];
  top5Questions: string;
  communicationTone: string;
  existingSolutions: string[];
  
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
  agreedValue: '',
  valueNotes: '',
  paymentMethods: [],
  recurringReminder: null,
  mainFunctions: [],
  top5Questions: '',
  communicationTone: '',
  existingSolutions: [],
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
  | 'integration'
  | 'digital'
  | 'materials'
  | 'success';

export const STEP_PROGRESS: Record<QuizStep, number> = {
  loading: 0,
  welcome: 0,
  company: 25,
  personalization: 50,
  integration: 75,
  digital: 90,
  materials: 95,
  success: 100,
};
