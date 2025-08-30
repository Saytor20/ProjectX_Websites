import { z } from 'zod';

// Menu item schema
const MenuItemSchema = z.object({
  item_en: z.string(),
  item_ar: z.string(),
  price: z.number(),
  currency: z.string(),
  description: z.string().optional(),
  image: z.string().optional(),
  offer_price: z.number().nullable().optional(),
  discount: z.string().optional(),
  menu_id: z.number()
});

// Restaurant info schema
const RestaurantInfoSchema = z.object({
  id: z.string(),
  name: z.string(),
  region: z.string(),
  state: z.string(),
  country: z.string(),
  coordinates: z.object({
    latitude: z.number(),
    longitude: z.number()
  }),
  rating: z.number().min(0).max(5),
  review_count: z.number(),
  type_of_food: z.string(),
  hungerstation_url: z.string().url().optional()
});

// Complete Restaurant schema
export const RestaurantSchema = z.object({
  restaurant_info: RestaurantInfoSchema,
  menu_categories: z.record(z.string(), z.array(MenuItemSchema))
});

// TypeScript type derived from schema
export type Restaurant = z.infer<typeof RestaurantSchema>;
export type MenuItem = z.infer<typeof MenuItemSchema>;
export type RestaurantInfo = z.infer<typeof RestaurantInfoSchema>;

// Validation helper
export function validateRestaurant(data: unknown): Restaurant {
  return RestaurantSchema.parse(data);
}

// Safe validation helper (returns result object)
export function safeValidateRestaurant(data: unknown) {
  return RestaurantSchema.safeParse(data);
}