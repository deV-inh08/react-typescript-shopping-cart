import React from "react";
import { Button } from "@mui/material";
import {Wrapper} from "./item.styles"
import { CartItemType } from "../App";

// types
type Props = {
    item: CartItemType;
    handleAddToCart: (clickedItem: CartItemType) => void;
};

const Item: React.FC<Props> = ({item, handleAddToCart}) => (
    <Wrapper>
        <img src={item.image} alt=""/>
        <div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <h3>{item.price}</h3>
        </div>
        <Button onClick={() => handleAddToCart(item)}>Add To Cart</Button>
    </Wrapper>
);

export default Item;