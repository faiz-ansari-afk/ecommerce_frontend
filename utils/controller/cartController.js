import { CART_ENDPOINT } from '@/utils/constants/endpoints';
import { getCoverImageUrl } from '@/utils/controller/productController';
import { getAuthJWT } from '@/utils/controller/sessionController';
import { getUser } from '@/utils/controller/auth';
import { destroyCookie, parseCookies, setCookie } from 'nookies';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import nookies from 'nookies';

export async function updateCartStatus({ cart_status, cartID }) {
  const jwt = getAuthJWT();

  const cartData = JSON.stringify({
    data: {
      cart_status,
    },
  });

  try {
    const config = {
      method: 'put',
      maxBodyLength: Infinity,
      url: CART_ENDPOINT(cartID),
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      data: cartData,
    };

    const result = await axios(config);
    if (cart_status === 'ordered') {
      destroyCookie({}, 'cart_uid', {
        path: '/', // THE KEY IS TO SET THE SAME PATH
      });
    }

    return result.data.data;
  } catch (error) {
    console.log('Get Cart Error', error);
  }
}
export const getCarts = async ({ getByCartUID = null }) => {
  let route = `${process.env.NEXT_PUBLIC_WEBSITE}/api/carts?filters[$and][0][cart_uid][$eq]=${getByCartUID}`;

  // if (getByCartUID) {
  //   route = `${route}`;
  // }
  const jwt = getAuthJWT();
  try {
    const config = {
      method: 'get',
      url: route,
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    };

    const result = await axios(config);

    const data = result.data.data;
    return data;
  } catch (error) {
    console.log('Get Cart Error', error);
    return null;
  }
};
// Get Local Cart
function mapUserCartToRealCart(cart) {
  const mappedCart = {
    attributes: {
      cart_data: cart.cart_data,
      cart_uid: cart.cart_uid,
      cart_status: cart.cart_status,
    },
    id: cart.id,
  };
  return mappedCart;
}
// Get Local Cart
export async function getMyCart(ctx) {
  const user = await getUser(null, ctx);
  if (user) {
    //return cart that is available in user
    if (user.current_cart) {
      return mapUserCartToRealCart(user.current_cart);
    }
  }
  let cart_uid = null;
  const cookie = parseCookies('cart_uid');
  cart_uid = cookie.cart_uid;
  if (ctx) {
    const cookie = nookies.get(ctx);
    cart_uid = cookie.cart_uid;
  }

  const myCart = await getCarts({ getByCartUID: cart_uid });
  if (!myCart) return null;
  if (myCart && myCart.length === 0) {
    destroyCookie({}, 'cart_uid', {
      path: '/',
    });
    return null;
  }
  return myCart[0];
}

export const addToCart = async (variantOfProduct) => {
  const jwt = getAuthJWT();
  const productDetail = {
    ...variantOfProduct,
    quantity: 1,
  };
  // when first time adding to  cart, add cart_id to cookies to save info of cart
  const cookie = parseCookies('cart_uid');

  if (cookie.cart_uid) {
    return updateCart({ variantOfProduct });
  }

  const cartData = JSON.stringify({
    data: {
      cart_uid: uuidv4(),
      cart_data: {
        products: [productDetail],
      },
    },
  });
  try {
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: CART_ENDPOINT(),
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      data: cartData,
    };

    const result = await axios(config);
    setCookie(null, 'cart_uid', result.data.data.attributes.cart_uid, {
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });

    return result.data.data;
  } catch (error) {
    console.log('Add to Cart Error', error);
  }
};

export async function updateCart({ variantOfProduct, quantity }) {
 
  const jwt = getAuthJWT();

  const myCart = await getMyCart();
  const cartID = myCart.id;

  const newProductDetail = {
    ...variantOfProduct,
    quantity: 1,
  };

  const productsInCart = myCart.attributes.cart_data.products;

  //** map through cart products to find if that product exist or not

  const existedProduct = productsInCart.find((productInCart) => {
    //check ID of product
    if (productInCart.id === variantOfProduct.id) {
      //check if incoming item size and price field is available or not
      if (variantOfProduct.size_and_price && productInCart.size_and_price) {
        return (
          variantOfProduct.size_and_price.id === productInCart.size_and_price.id
        );
      } else {
        return variantOfProduct.colorID === productInCart.colorID;
      }
    }
    return false;
  });

  //update cart products pov
  const cartProducts = existedProduct
    ? productsInCart.map((productInCart) => {
        if (productInCart.id !== variantOfProduct.id) return productInCart;

        const { size_and_price, colorID } = variantOfProduct;

        const {
          size_and_price: productSizeAndPrice,
          colorID: productColorID,
          quantity: productQuantity,
        } = productInCart;

        if (size_and_price && productSizeAndPrice) {
          if (size_and_price.id === productSizeAndPrice.id) {
            return {
              ...productInCart,
              quantity: quantity ?? productQuantity + 1,
            };
          }
        } else {
          if (colorID === productColorID) {
            return {
              ...productInCart,
              quantity: quantity ?? productQuantity + 1,
            };
          }
        }
        return productInCart;
      })
    : [...productsInCart, newProductDetail];

  const cartData = JSON.stringify({
    data: {
      cart_data: {
        products: cartProducts,
      },
    },
  });

  try {
    const config = {
      method: 'put',
      maxBodyLength: Infinity,
      url: CART_ENDPOINT(cartID),
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      data: cartData,
    };

    const result = await axios(config);
    return result.data.data;
  } catch (error) {
   console.log('Updating Cart Error', error);
  }
}

export async function deleteCartItem(productToBeDeleted) {
  const jwt = getAuthJWT();

  const myCart = await getMyCart();
  const cartID = myCart.id;

  const productsInCart = myCart.attributes.cart_data.products;

  // map through cart products to find if that product exist or not

  const newProductsCart = productsInCart.filter((product) => {
    if (product.id === productToBeDeleted.id) {
      //check if incoming item size and price field is available or not
      if (productToBeDeleted.size_and_price && product.size_and_price) {
        if (productToBeDeleted.size_and_price.id === product.size_and_price.id)
          return false;
      } else {
        if (productToBeDeleted.colorID === product.colorID) return false;
      }
    }
    return true;
  });

  const cartData = JSON.stringify({
    data: {
      cart_data: {
        products: newProductsCart,
      },
    },
  });

  try {
    const config = {
      method: 'put',
      maxBodyLength: Infinity,
      url: CART_ENDPOINT(cartID),
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      data: cartData,
    };

    const result = await axios(config);
    return result.data.data;
  } catch (error) {
    console.log('deleting cart items error', error);
  }
}

export function getCount(cart) {
  let count = 0;
  if (cart?.attributes?.cart_data?.products?.length > 0) {
    cart?.attributes?.cart_data?.products?.forEach(
      (product) => (count += product.quantity)
    );
  } 
  return count;
}

export function getTotalPrice(cart) {
  let total = 0;
  cart?.attributes?.cart_data?.products?.forEach(
    (product) => (total += getPrice(product))
  );
  return total;
}

export function getPrice(productOfCart) {
  let price = 0;
  if (productOfCart.size_and_price) {
    price = productOfCart.quantity * productOfCart.size_and_price.price;
  } else {
    price = productOfCart.quantity * productOfCart.price;
  }
  return price;
}
