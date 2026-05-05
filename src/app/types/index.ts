export interface Equipment {
  id: string;
  name: string;
  category: string;
  image: string;
  pricePerDay: number;
  pricePerHour: number;
  location: string;
  neighborhood?: string;
  status: 'Müsait' | 'Kiralıkta';
  description: string;
  owner: string;
  rating: number;
  reviews: Review[];
  lastMaintenance?: string;
  unavailablePeriods?: UnavailablePeriod[];
}

export interface UnavailablePeriod {
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface UserReview {
  id: string;
  reviewerId: string;
  reviewerName: string;
  rating: number;
  comment: string;
  date: string;
  rentalId?: string;
  equipmentName?: string;
}

export interface Rental {
  id: string;
  equipmentId: string;
  equipmentName: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'active' | 'completed' | 'pending';
  ownerId?: string;
  ownerName?: string;
  renterId?: string;
  renterName?: string;
  ownerReviewed?: boolean;
  renterReviewed?: boolean;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name?: string;
  role: 'farmer' | 'owner' | 'admin';
  avatar?: string;
  tcNo?: string;
  birthDate?: string;
  phone?: string;
  rating?: number;
  reviewCount?: number;
  reviews?: UserReview[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Notification {
  id: string;
  message: string;
  date: string;
  read: boolean;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface Chat {
  id: string;
  equipmentId: string;
  equipmentName: string;
  ownerId: string;
  ownerName: string;
  farmerId: string;
  farmerName: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  createdAt: string;
}