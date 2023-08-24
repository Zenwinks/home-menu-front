interface Ingredient {
  _id?: string;
  name: string;
  count: number;
}

interface Drink {
  _id?: string;
  name: string;
  description?: string;
  ingredients?: Ingredient[];
  category?: Category;
  icon?: string;
  count: number;
  private: boolean;
}

interface Category {
  _id?: string;
  name: string;
}

interface User {
  username: string;
  password: string;
}