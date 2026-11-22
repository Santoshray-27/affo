// BUSINESS PROFILE & COMPLIANCE CONFIGURATION
// All details are placeholder samples. 
// TODO: confirm with client (legal entity name, registered office address, helpline, and active FSSAI license).

export interface BusinessInfo {
  brandName: string;
  hindiName: string;
  tagline: string;
  hindiTagline: string;
  fssaiNumber: string; // Placeholder
  supportEmail: string;
  supportPhone: string;
  whatsappNumber: string;
  registeredAddress: string;
  fulfillmentHubs: string[];
  operatingHours: string;
  socialLinks: {
    instagram: string;
    facebook: string;
    twitter: string;
    youtube: string;
  };
  metricsPlaceholders: {
    activeHouseholds: string;
    acresCultivated: string;
    citiesServed: string;
    morningDeliveryRate: string;
  };
}

export const businessInfo: BusinessInfo = {
  brandName: 'Annapurna Farm Fresh & Organics',
  hindiName: 'अन्नपूर्णा',
  tagline: 'Farm Fresh & 100% Organics',
  hindiTagline: 'अन्नपूर्णा – सबके लिए स्वस्थ भोजन',
  fssaiNumber: '10023000000000 (Demo Placeholder)', // TODO: confirm with client
  supportEmail: 'care@annapurnafarmfresh.demo',
  supportPhone: '+91 98765 43210 (Demo Helpline)',
  whatsappNumber: '+91 98765 43210',
  registeredAddress: 'Plot 42, Green Agro Hub, Mandi Road, Sector 62, Gurugram / New Delhi NCR - 122001 (Demo Location)',
  fulfillmentHubs: [
    'South Delhi Cold Hub',
    'Gurugram Cyber-City Hub',
    'Noida Central Distribution Hub',
  ],
  operatingHours: 'Morning Slot: 6:00 AM – 9:00 AM | Evening Slot: 5:00 PM – 8:00 PM',
  socialLinks: {
    instagram: 'https://instagram.com/annapurnafarmfresh.demo',
    facebook: 'https://facebook.com/annapurnafarmfresh.demo',
    twitter: 'https://twitter.com/annapurnafarm',
    youtube: 'https://youtube.com/@annapurnafarmfresh',
  },
  metricsPlaceholders: {
    activeHouseholds: '15,400+',
    acresCultivated: '420+ Acres',
    citiesServed: 'NCR & Tri-City',
    morningDeliveryRate: '99.4%',
  },
};

