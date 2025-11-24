import { useState, useEffect, useMemo } from "react";
import { db } from "../data/db";

export default function useCart() {

    const initialCart = () => {
        const localStorageCart = localStorage.getItem("cart");
        return localStorageCart ? JSON.parse(localStorageCart) : [];
    }

    const [data] = useState(db);
    const [cart, setCart] = useState(initialCart);

    const MAX_ITEMS = 5;
    const MIN_ITEMS = 1;

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    function addToCart(item) {
        const index = cart.findIndex(current => current.id === item.id);

        // -1 -> doesn't exist
        if (index !== -1) {
            if (cart[index].quantity >= MAX_ITEMS) {
                return;
            }

            const updatedCart = [...cart];
            updatedCart[index].quantity++;
            setCart(updatedCart);
            return;
        }

        item.quantity = 1;
        setCart([...cart, item]);
    }

    function removeFromCart(id) {
        const updatedCart = cart.filter(x => x.id !== id);
        setCart(updatedCart);
    }

    function increaseQuantity(id) {
        const updatedCart = cart.map(item => {
            if (item.id === id && item.quantity < MAX_ITEMS) {
                return {
                    ...item,
                    quantity: item.quantity + 1
                }
            }

            return item;
        });
        setCart(updatedCart);
    }

    function decreaseQuantity(id) {
        const updatedCart = cart.map(item => {
            if (item.id === id && item.quantity > MIN_ITEMS) {
                return {
                    ...item,
                    quantity: item.quantity - 1
                }
            }

            return item;
        });
        setCart(updatedCart);
    }

    function clearCart() {
        setCart([]);
    }

    // useMemo -> se ejecuta cuando uno de los elementos del array de dependencias cambia
    const isEmpty = useMemo(() => cart.length === 0, [cart])
    const cartTotal = useMemo(() => cart.reduce((total, item) => total + (item.quantity * item.price), 0), [cart]);

    return {
        data,
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        isEmpty,
        cartTotal
    }
}