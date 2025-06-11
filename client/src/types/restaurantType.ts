import type { OrderState } from "./OrderType";

export type MenuItem={
  _id:string,
  name:string,
  description:string,
  price:number,
  image:string,
}

export type Restaurant={
  _id:string,
  user:string,
 restaurantName:string,
 city:string,
 country:string,
 deliveryTime:number,
 cuisines:string[],
 menus:MenuItem[],
 image:string,
 imageUrl:string,
}

export type SearchedRestaurant={
  data:Restaurant[],
}

export interface RestaurantStore {
  loading: boolean;
  appliedFilters:string[];
  searchedRestaurant: SearchedRestaurant | null;
  restaurantResult: Restaurant | null;
  restaurant:  Restaurant | null;
  singleRestaurant: Restaurant | null;
  createRestaurant: (formData: FormData) => Promise<void>;
  getRestaurants: () => Promise<void>;
  updateRestaurant: (formData: FormData) => Promise<void>;
  searchRestaurant: (searchText: string, searchQuery: string, selectedCuisines: any) => Promise<void>;
  clearRestaurantState: () => void;
  addMenuTorestaurant: (menu: any) => Promise<void>;
  setAppliedFilters: (filters: string) =>void;
  resetFilters: () => void;
  restaurantOrders:OrderState[];
  getRestaurantOrders: (id: string) => Promise<void>;
  getSingleRestaurant: (id: string) => Promise<void>;
  updateRestaurantOrders: (id: string, order: any) => Promise<void>;
}