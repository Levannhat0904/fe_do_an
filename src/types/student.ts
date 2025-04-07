export interface Student {
  id: number;
  user_id: number;
  studentCode: string;
  fullName: string;
  gender: 'male' | 'female' | 'other';
  birth_date: string;
  phone: string;
  address: string;
  province: string;
  district: string;
  ward: string;
  department: string;
  major: string;
  class_name: string;
  school_year: number;
  avatarPath: string;
  citizen_id: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_relationship: string;
  status: 'active' | 'graduated' | 'suspended';
} 