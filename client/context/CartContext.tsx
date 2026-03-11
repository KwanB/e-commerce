import { dummyCart } from "@/assets/assets";
import { Product } from "@/assets/constants/types";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

export type CartItem = {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  size: string;
  price: number;
};

type CartContextType = {
  cartItem: CartItem[];
  addToCart: (product: Product, size: string) => Promise<void>;
  removeFormCart: (itemId: string, size: string) => Promise<void>;
  updateQuantity: (
    itemId: string,
    quantity: number,
    size: string,
  ) => Promise<void>;
  clearCart: () => Promise<void>;
  cartTotal: number;
  itemCount: number;
  isLoading: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItem, setCartItem] = useState<CartItem[]>([]);
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [cartTotal, setCartTotal] = useState(0);

  const fetchCart = async () => {
    setisLoading(true);
    const serverCart = dummyCart;
    const mappedItem: CartItem[] = serverCart.items.map((item: any) => ({
      id: item.product._id,
      productId: item.product._id,
      product: item.product,
      quantity: item.quantity,
      size: item?.size || "M",
      price: item.price,
    }));
    setCartItem(mappedItem);
    setCartTotal(serverCart.totalAmount);
    setisLoading(false);
  };

  const addToCart = async (product: Product, size: string) => {};
  const removeFormCart = async (productId: string, size: string) => {};
  const updateQuantity = async (
    productId: string,
    quantity: number,
    size: string = "M",
  ) => {};

  const clearCart = async () => {};
  const itemCount = cartItem.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItem,
        addToCart,
        removeFormCart,
        updateQuantity,
        clearCart,
        cartTotal,
        itemCount,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCrat must be used within a CartProvider");
  }
  return context;
}
