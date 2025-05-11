interface Dormitory {
  applicationId: string;
  registrationDate: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  approvedBy: string | null;
  approvalDate: string | null;
  rejectionReason: string | null;
  buildingName: string;
  roomNumber: string;
  bedNumber: string;
  semester: string;
  schoolYear: string;
  checkInDate: string | null;
  checkOutDate: string | null;
  monthlyFee: number;
  depositAmount: number;
  paymentStatus: 'unpaid' | 'partial' | 'paid';
}
interface HistoryItem {
  date: string;
  action: string;
  description: string;
  user: string;
}

interface Roommate {
  id: number;
  studentCode: string;
  fullName: string;
  gender: string;
  status: string;
}

interface DormitoryRegistration extends any { }
