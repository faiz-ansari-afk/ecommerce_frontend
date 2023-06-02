import axios from 'axios';
import { getAuthJWT } from './sessionController';

// const shopsURL = `${process.env.NEXT_PUBLIC_WEBSITE}/api/shops?populate=*`;

const shopsURL = `${process.env.NEXT_PUBLIC_WEBSITE}/api/shops?populate[categories][populate]=*&populate[images][populate]=*&populate[cover_image][populate]=*&populate[products][populate]=*`;

export const getAllShops = async () => {
  try {
    const shops_config = {
      method: 'get',
      url: shopsURL,
    };

    const shopsData = await axios(shops_config);

    const shops = shopsData.data.data;
    return shops;
  } catch (error) {
    //console.log('Fetching all shops error', error);
    return null;
  }
};
// export const searchShops = async ({ searchQuery }) => {
//   const shopsSearchURL = `${process.env.NEXT_PUBLIC_WEBSITE}/api/shops?populate[cover_image][populate]=*&filters[$or][0][name][$containsi]=${searchQuery}&filters[$or][1][area][$containsi]=${searchQuery}&filters[$or][2][search_text][$containsi]=${searchQuery}&sort[0]=createdAt%3Adesc&pagination[pageSize]=50`;
//   try {
//     const shops_config = {
//       method: 'get',
//       url: shopsSearchURL,
//     };

//     const shopsData = await axios(shops_config);

//     const shops = shopsData.data.data;
//     return shops;
//   } catch (error) {
//     //console.log('searching in all shops error', error);
//     return null;
//   }
// };

export async function updateFollowListOfShop({ action, id, email }) {
  const jwt = getAuthJWT();

  const shopURL = `${process.env.NEXT_PUBLIC_WEBSITE}/api/shops/${id}`;
  let allFollowers = [];
  try {
    const myShopResult = await axios.get(shopURL);
    const myShop = myShopResult.data.data;

    if (action === 'follow') {
      ////console.log('Do follow');
      allFollowers = [...myShop.attributes.followers.users, email];
    } else {
      ////console.log('Do unfollow');
      if (myShop.attributes.followers.users.length === 0) return null;

      allFollowers = myShop.attributes.followers.users.filter(
        (follower) => follower !== email
      );
      ////console.log('updated follower to remove', allFollowers);
    }

    const followerData = JSON.stringify({
      data: {
        followers: {
          users: allFollowers,
        },
      },
    });

    const config = {
      method: 'put',
      maxBodyLength: Infinity,
      url: shopURL,
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      data: followerData,
    };

    const result = await axios(config);
    return result.data.data;
  } catch (err) {
    ////console.log('updateFollowListOfShop error', err);
    return null;
  }
}
