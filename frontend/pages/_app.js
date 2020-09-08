import React, { useState, useEffect } from "react";
import { ApolloProvider } from "@apollo/client";
import Cookie from "js-cookie";

import { useApollo } from "../lib/apollo";
import Layout from "../components/Layout";
import AppContext from "../context/AppContext";

function MyApp({ Component, pageProps, isAuthenticated }) {
  const apolloClient = useApollo(pageProps.initialApolloState);
  const [user, setUser] = useState(null);
  const [myCart, setMyCart] = useState({
    items: [],
    total: 0,
  });
  useEffect(() => {
    const token = Cookie.get("token");
    const cart = Cookie.get("cart");
    if (typeof cart === "string" && cart !== "undefined") {
      JSON.parse(cart).forEach((item) => {
        setMyCart({
          items: [...myCart.items, item],
          total: item.price * item.quantity,
        });
      });
    }
    if (token) {
      // authenticate the token on the server and place set user object
      fetch(`${process.env.NEXT_PUBLIC_API_URL}users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then(async (res) => {
        // if res comes back not valid, token is not valid
        // delete the token and log the user out on client
        if (!res.ok) {
          Cookie.remove("token");
          setUser(null);
          return null;
        }
        const users = await res.json();
        setUser(users);
      });
    }
  }, []);

  const addItem = (item) => {
    let { items } = myCart;
    //check for item already in cart
    //if not in cart, add item if item is found increase quanity ++
    const newItem = items.find((i) => i._id === item._id);
    // if item is not new, add to cart, set quantity to 1
    if (!newItem) {
      const myitems = [...items, { ...item, quantity: 1 }];
      const newTotal = myCart.total + item.price;
      const updated = {
        items: myitems,
        total: newTotal,
      };
      setMyCart(updated);
    } else {
      console.log("else---->", item);

      const newItems = items.reduce(
        (acc, curr) => {
          if (curr._id === item._id) {
            const newObj = {
              ...curr,
              quantity: curr.quantity + 1,
            };
            const filtered = acc.filter((cuItem) => cuItem._id !== curr._id);

            acc = [...filtered, newObj];
          }
          return acc;
        },
        [...items]
      );
      //   const mitems = myCart.items.map((newItem) =>
      //     item.id === newItem.id
      //       ? Object.assign({}, newItem, { quantity: newItem.quantity + 1 })
      //       : { ...newItem, quantity: 1 }
      //   );
      const mtotal = myCart.total + item.price;
      const updated = {
        items: newItems,
        total: mtotal,
      };
      setMyCart(updated);
    }
  };

  console.log("my cart", myCart);

  useEffect(() => {
    if (myCart) Cookie.set("cart", myCart.items);
  }, [myCart]);

  const removeItem = (item) => {
    let { items } = myCart;
    //check for item already in cart
    //if not in cart, add item if item is found increase quanity ++
    const newItem = items.find((i) => i._id === item._id);
    if (newItem.quantity > 1) {
      setMyCart(
        {
          items: myCart.items.map((item) =>
            item.id === newItem.id
              ? Object.assign({}, item, { quantity: item.quantity - 1 })
              : item
          ),
          total: myCart.total - item.price,
        },
        () => Cookie.set("cart", myCart.items)
      );
    } else {
      const items = [...myCart.items];
      const index = items.findIndex((i) => i._id === newItem._id);

      items.splice(index, 1);
      setMyCart({ items: items, total: myCart.total - item.price }, () =>
        Cookie.set("cart", myCart.items)
      );
    }
  };

  return (
    <ApolloProvider client={apolloClient}>
      <AppContext.Provider
        value={{
          user,
          isAuthenticated: !!user,
          setUser,
          cart: myCart,
          addItem: addItem,
          removeItem: removeItem,
        }}
      >
        <Layout {...pageProps}>
          <Component {...pageProps} />
        </Layout>
      </AppContext.Provider>
      <style jsx global>
        {`
          a {
            color: white !important;
          }
          a:link {
            text-decoration: none !important;
            color: white !important;
          }
          a:hover {
            color: white;
          }
          .card {
            display: inline-block !important;
          }
          .card-columns {
            column-count: 3;
          }
        `}
      </style>
    </ApolloProvider>
  );
}

export async function getStaticProps({ Component, router, ctx }) {
  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }
  return { pageProps };
}

export default MyApp;
