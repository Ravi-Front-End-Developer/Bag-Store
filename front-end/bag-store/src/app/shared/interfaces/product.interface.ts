export interface Product {
  bgcolor?: string;
  category?: string;
  description?: string;
  discount?: number;
  image?: string;
  name?: string;
  panelcolor?: string;
  price?: number;
  textcolor?: string;
  __v?: number;
  _id?: string;
}

export interface CartItem {
  productId: {
    _id: string;
    image: string;
    name: string;
    price: number;
    discount: number;
    description: string;
    category: string;
    bgcolor: string;
    panelcolor: string;
    textcolor: string;
    __v: number;
  };
  quantity: number;
}
