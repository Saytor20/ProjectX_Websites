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
  logo?: string;
  brand?: { 
    primary: string; 
    surface: string; 
    onPrimary: string; 
    onSurface: string; 
    accent?: string;
  };
  social?: { 
    facebook?: string; 
    instagram?: string; 
    twitter?: string; 
    tiktok?: string;
  };
  hours?: Array<{ 
    day: string; 
    open: string; 
    close: string; 
  }>;
  locationUrl?: string;
}