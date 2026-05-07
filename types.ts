import React from 'react';

export interface ServiceItem {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export interface Testimonial {
  id: number;
  name: string;
  text: string;
  rating: number;
  treatment?: string;
}

export interface DoctorDetails {
  name: string;
  title: string;
  qualifications: string;
  description: string;
  awards?: string[];
  image: string;
}

export enum Department {
  DERMATOLOGY = 'dermatology',
  CARDIOLOGY = 'cardiology',
  GENERAL = 'general',
}