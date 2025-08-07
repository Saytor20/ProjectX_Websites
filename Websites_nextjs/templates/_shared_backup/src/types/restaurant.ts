export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
}

export interface RestaurantData {
  name: string;
  description: string;
  phone: string;
  address: string;
  email?: string;
  website?: string;
  heroImage: string;
  aboutImage?: string;
  menu: MenuItem[];
  gallery?: string[];
}