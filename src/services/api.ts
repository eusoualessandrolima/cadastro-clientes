export interface OnboardingData {
  company: {
    responsibleName: string;
    companyName: string;
    segment: string;
    cpfCnpj: string;
    email: string;
    phone: string;
  };
  agreement: {
    services: string[];
    contractModel: 'monthly' | 'single';
    agreedValue: number;
    paymentMethods: string[];
    recurringReminder: boolean | null;
  };
  assistant: {
    mainFunctions: string[];
    top5Questions: string;
    communicationTone: string;
    existingSolutions: string[];
  };
  digital: {
    contactPhones: string;
    paymentMethodsAccepted: string;
    address: string;
    instagram: string;
    website: string;
    restrictedTopics: string;
  };
  materials: {
    additionalInfo: string;
    uploadedFiles: Array<{
      name: string;
      size: number;
      type: string;
    }>;
  };
  metadata: {
    timestamp: string;
    source: string;
  };
}

const WEBHOOK_URL = 'https://webhook.companychatautomacoeseia.com/webhook/formcliente';

export async function sendOnboardingData(data: OnboardingData): Promise<{ success: boolean }> {
  console.log('📤 Preparing to send onboarding data...');
  console.log('📦 Payload:', JSON.stringify(data, null, 2));

  if (!WEBHOOK_URL) {
    console.log('⚠️ No webhook URL configured. Data logged to console only.');
    console.log('ℹ️ Set VITE_WEBHOOK_URL environment variable to enable webhook.');
    return { success: true };
  }

  try {
    console.log('📤 Sending to webhook:', WEBHOOK_URL);
    
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Webhook error ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Webhook response:', result);
    
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending to webhook:', error);
    throw error;
  }
}
