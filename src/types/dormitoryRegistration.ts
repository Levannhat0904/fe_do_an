export interface DormitoryRegistration {
  id: number;
  student_id: number;
  registration_number: string;
  academic_year: string;
  semester: string;
  desired_room_type: string;
  desired_building_id: number;
  registration_date: string;
  family_situation: string;
  scholarship_type: string;
  distance_to_school: number;
  priority_category: string;
  income_proof_path: string;
  priority_documents_path: string;
  health_status: string;
  medical_conditions: string;
  allergies: string;
  lifestyle_preferences: string;
  roommate_preferences: string;
  status: 'pending' | 'approved' | 'rejected' | 'waitlisted';
  reviewed_by: number;
  review_date: string;
  review_notes: string;
  rejection_reason: string;
  created_at: string;
  updated_at: string;
} 