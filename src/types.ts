export type Category = 'Dairy' | 'Produce' | 'Meat' | 'Bakery' | 'Pantry' | 'Frozen';

export interface Product {
  id: string;
  name: string;
  category: Category;
  quantity: string;
  expiryDate: string; // ISO string
  reminderDays: number;
  status: 'critical' | 'warning' | 'safe';
  imageUrl?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
}
