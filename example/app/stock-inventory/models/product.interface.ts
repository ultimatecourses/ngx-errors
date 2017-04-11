export interface Product {
  id: number,
  price: number,
  name: string
}

export interface Item {
  product_id: number,
  quantity: number
}