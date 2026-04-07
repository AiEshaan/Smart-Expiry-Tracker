import { Product, Category } from './types';
import { addDays, subDays, formatISO } from 'date-fns';

export const CATEGORIES: { label: Category; icon: string; color: string }[] = [
  { label: 'Dairy', icon: 'droplet', color: 'secondary' },
  { label: 'Produce', icon: 'leaf', color: 'primary' },
  { label: 'Meat', icon: 'fish', color: 'primary' },
  { label: 'Bakery', icon: 'bread', color: 'secondary' },
  { label: 'Pantry', icon: 'archive', color: 'primary' },
  { label: 'Frozen', icon: 'snowflake', color: 'secondary' },
];

const today = new Date();

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Whole Milk',
    category: 'Dairy',
    quantity: '1 Liter',
    expiryDate: formatISO(today),
    reminderDays: 1,
    status: 'critical',
    imageUrl: 'https://images.unsplash.com/photo-1550583724-125581f77833?auto=format&fit=crop&q=80&w=200&h=200',
    barcode: '5410000000017',
  },
  {
    id: '2',
    name: 'Baby Spinach',
    category: 'Produce',
    quantity: '200g',
    expiryDate: formatISO(today),
    reminderDays: 1,
    status: 'critical',
    imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=200&h=200',
    barcode: '0000000000000',
  },
  {
    id: '3',
    name: 'Greek Yogurt',
    category: 'Dairy',
    quantity: '500g',
    expiryDate: formatISO(addDays(today, 2)),
    reminderDays: 3,
    status: 'warning',
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=200&h=200',
  },
  {
    id: '4',
    name: 'Chicken Breast',
    category: 'Meat',
    quantity: '500g',
    expiryDate: formatISO(addDays(today, 3)),
    reminderDays: 1,
    status: 'warning',
    imageUrl: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&q=80&w=200&h=200',
  },
  {
    id: '5',
    name: 'Organic Eggs',
    category: 'Dairy',
    quantity: '12 pack',
    expiryDate: formatISO(today),
    reminderDays: 3,
    status: 'critical',
    imageUrl: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&q=80&w=200&h=200',
  },
  {
    id: '6',
    name: 'Atlantic Salmon',
    category: 'Meat',
    quantity: '300g',
    expiryDate: formatISO(addDays(today, 5)),
    reminderDays: 1,
    status: 'safe',
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=200&h=200',
  },
];
