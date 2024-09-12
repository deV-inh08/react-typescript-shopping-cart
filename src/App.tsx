import React from "react";
import { useState } from "react";
import { useQuery } from "react-query";

// Components
import Cart from "./Cart/Cart";
import Item from "./Item/item";
import { Drawer } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import Badge from "@mui/material/Badge";
import Grid2 from "@mui/material/Grid2";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

// styles
import { Wrapper, StyledButton } from "./App.styles";

// types
export type CartItemType = {
  id: number;
  category: string;
  description: string;
  image: string;
  price: number;
  title: string;
  amount: number;
};

// get API
const getProducts = async (): Promise<CartItemType[]> =>
  await (await fetch("https://fakestoreapi.com/products")).json();

function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([] as CartItemType[]);

  const { data, isLoading, error } = useQuery<CartItemType[]>(
    "products",
    getProducts
  );

  const getTotalItem = (items: CartItemType[]) =>
    items.reduce((ack: number, item) => ack + item.amount, 0);
  const handleAddToCart = (clickedItem: CartItemType) => {
    console.log("hello")

    setCartItems(prev => {
      // 1. Is the item already added in the cart
      const isItemInCart = prev.find(item => item.id === clickedItem.id);
      if(isItemInCart) {
        return prev.map(item => (
          item.id === clickedItem.id 
            ? {...item, amount: item.amount + 1}
            : item
        ))
      }

      // First time the item is added;
      return [...prev, {...clickedItem, amount: 1}];
    })
  }
  const handleRemoveFromCart = (id: number) => {
    setCartItems(prev => (
      prev.reduce((ack, item) => {
        if(item.id === id) {
          if(item.amount === 1) return ack;
          return [...ack, {...item, amount: item.amount - 1}]
        } else {
          return [...ack, item];
        }
      }, [] as CartItemType[])
    ))
  }

  if (isLoading) return <LinearProgress />;
  if (error) return <p>Somethings went wrong ....</p>;
  return (
    <Wrapper>
      <Drawer anchor="right" open={cartOpen} onClose={() => setCartOpen(false)}>
        <Cart
          cartItems={cartItems}
          addToCart={handleAddToCart}
          removeFromCart={handleRemoveFromCart}
        ></Cart>
      </Drawer>
      <StyledButton onClick={() => setCartOpen(true)}>
        <Badge badgeContent={getTotalItem(cartItems)} color="error">
          <AddShoppingCartIcon />
        </Badge>
      </StyledButton>
      <Grid2 container spacing={3}>
        {data?.map((item) => (
          <Grid2 size={{ xs: 12, sm: 4 }}>
            <Item
              key={item.id}
              item={item}
              handleAddToCart={handleAddToCart}
            ></Item>
          </Grid2>
        ))}
      </Grid2>
    </Wrapper>
  );
}

export default App;
