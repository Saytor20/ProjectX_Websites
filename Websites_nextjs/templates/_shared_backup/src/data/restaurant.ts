import { RestaurantData } from '@/types/restaurant';

export const restaurantData: RestaurantData = {
  name: "Bella Vista",
  description: "Experience authentic Italian cuisine in an elegant atmosphere. Our chefs use traditional recipes passed down through generations, combined with the finest locally sourced ingredients to create unforgettable dining experiences.",
  phone: "(555) 123-4567",
  address: "616 Lumination Ave, Columbus OH 43240",
  email: "info@bellavista.com",
  website: "www.bellavista.com",
  heroImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  aboutImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  menu: [
    {
      id: "1",
      name: "Margherita Pizza",
      description: "Fresh mozzarella, tomato sauce, basil, and extra virgin olive oil",
      price: 18,
      category: "Pizza",
      image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.0.3&ixid=M3wxMJA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80"
    },
    {
      id: "2",
      name: "Spaghetti Carbonara",
      description: "Traditional Roman pasta with pancetta, egg, pecorino cheese, and black pepper",
      price: 22,
      category: "Pasta",
      image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d874?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    {
      id: "3",
      name: "Osso Buco",
      description: "Braised veal shanks with vegetables, white wine, and broth",
      price: 32,
      category: "Main Course",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80"
    },
    {
      id: "4",
      name: "Bruschetta",
      description: "Grilled bread topped with fresh tomatoes, garlic, and basil",
      price: 12,
      category: "Appetizer",
      image: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    {
      id: "5",
      name: "Tiramisu",
      description: "Classic Italian dessert with coffee-soaked ladyfingers and mascarpone",
      price: 14,
      category: "Dessert",
      image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2062&q=80"
    },
    {
      id: "6",
      name: "Caesar Salad",
      description: "Crisp romaine lettuce with parmesan cheese, croutons, and caesar dressing",
      price: 16,
      category: "Salad",
      image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    }
  ],
  gallery: [
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2387&q=80"
  ]
};