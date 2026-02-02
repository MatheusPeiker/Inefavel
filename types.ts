
// Fixed: Added React import to resolve the 'Cannot find namespace React' error
import React from 'react';

export interface Service {
  id: string;
  category: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  icon: string;
}

export interface DeliveryCard {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface ContactFormData {
  name: string;
  email: string;
  objective: string;
  message: string;
}