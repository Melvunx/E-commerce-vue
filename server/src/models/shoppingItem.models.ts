export type ShoppingItem = {
  id: number;
  shopping_basket_id?: number;
  brand_id?: number;
  name: string;
  color?: string;
  description: string;
  item_image_url: string;
  price: number;
  quantity: number;
  dimensions?: string;
  stock_status: string;
  author?: string;
  created_at: Date;
};
