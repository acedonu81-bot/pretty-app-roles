export type { Pro } from '@/types';
export { ZONES } from '@/lib/constants';

export const PAYMENT_BENCHMARK = [
  { role: 'DJ',     avg: 320, min: 150, max: 900, pct_cash: 42, pct_transfer: 51, pct_platform: 7  },
  { role: 'Staff',  avg: 85,  min: 50,  max: 200, pct_cash: 65, pct_transfer: 30, pct_platform: 5  },
  { role: 'Makeup', avg: 180, min: 80,  max: 450, pct_cash: 35, pct_transfer: 55, pct_platform: 10 },
];

export const MOCK_MEDIA = [
  { id: 1, type: 'image', title: 'Fabrik — Noche Techno',    author: 'DJ Konrad',  thumb: 'https://images.unsplash.com/photo-1571935559147-9f30bd07a1ce?w=400&q=80', role: 'dj'     },
  { id: 2, type: 'video', title: 'Set Completo Razzmatazz',  author: 'Luna M.',    thumb: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80', role: 'dj'     },
  { id: 3, type: 'image', title: 'Backstage Estilismo VIP',  author: 'Carla V.',   thumb: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400&q=80', role: 'makeup' },
  { id: 4, type: 'image', title: 'Control Staff Entrada',    author: 'Marc D.',    thumb: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&q=80', role: 'staff'  },
  { id: 5, type: 'video', title: 'Aftermovie Ibiza 2024',    author: 'DJ Konrad',  thumb: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80', role: 'dj'     },
  { id: 6, type: 'image', title: 'Sesión Foto Artística',    author: 'Ana R.',     thumb: 'https://images.unsplash.com/photo-1605722243979-fe0be8cbb4b9?w=400&q=80', role: 'makeup' },
  { id: 7, type: 'image', title: 'Crowd Night — Madrid',     author: 'Staff Team', thumb: 'https://images.unsplash.com/photo-1574279606130-09958dc756f7?w=400&q=80', role: 'staff'  },
  { id: 8, type: 'video', title: 'Mix Session Studio',       author: 'VLTX',       thumb: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80', role: 'dj'     },
];
