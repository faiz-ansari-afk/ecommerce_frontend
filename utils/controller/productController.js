import slugify from 'slugify';
import axios from 'axios';

const productsURL = `${process.env.NEXT_PUBLIC_WEBSITE}/api/products?populate[color_and_size_variants][populate]=*&populate[category][populate]=*&populate[sub_category][populate]=*&populate[images][populate]=*&populate[cover_image][populate]=*&populate[product_hero][populate]=*&populate[shop][populate]=*&sort[0]=createdAt%3Adesc`;

export const getSlugText = (products) => {
  let slugLink = products.map((product) => slugify(product.attributes.name));

  //if only single product is passed
  if (products.length === 1) {
    slugLink = slugify(products[0].attributes.name);
  }
  return slugLink;
};

export const getAllProducts = async () => {
  try {
    const products_config = {
      method: 'get',
      url: productsURL,
    };

    // const result = await axios(config)
    const [productsData] = await Promise.all([axios(products_config)]);

    const products = productsData.data.data;
    return products;
  } catch (error) {
    ////console.log('Fetching all products error', error);
    return null;
  }
};
export const getProductFieldForCardDisplay = ({
  products,
  forBrowseComponent = false,
  forSearchComponent = false,
}) => {
  if (!products) return null;

  if (forBrowseComponent) {
    const reqFeildProducts = products.map((product) => ({
      attributes: {
        name: product.attributes.name,
        theme: product.attributes.theme,
        inStock: product.attributes.inStock,
        category: {
          data: {
            attributes: {
              name: product.attributes.category.data.attributes.name,
            },
          },
        },
        cover_image: {
          data: {
            attributes: {
              url: product.attributes.cover_image.data.attributes.url,
            },
          },
        },
      },
    }));
    return reqFeildProducts;
  }
  // if (forBrowseComponent) {
  //   const reqFeildProducts = products.map((product) => ({
  //     attributes: {
  //       name: product.attributes.name,
  //       theme: product.attributes.theme,
  //       inStock: product.attributes.inStock,
  //       category: {
  //         data: {
  //           attributes: {
  //             name: product.attributes.category.data.attributes.name,
  //           },
  //         },
  //       },
  //       cover_image: {
  //         data: {
  //           attributes: {
  //             url: product.attributes.cover_image.data.attributes.url,
  //           },
  //         },
  //       },
  //     },
  //   }));
  //   return reqFeildProducts;
  // }
  const reqFeildProducts = products.map((product) => ({
    attributes: {
      name: product.attributes.name,
      theme: product.attributes.theme,
      shop_price: product.attributes.shop_price,
      base_price: product.attributes.base_price,
      cover_image: {
        data: {
          attributes: {
            url: product.attributes.cover_image.data.attributes.url,
          },
        },
      },
      category: {
        data: {
          attributes: {
            name: product.attributes.category.data.attributes.name,
          },
        },
      },
      sub_category: {
        data: {
          attributes: {
            name: product.attributes.sub_category.data.attributes.name,
          },
        },
      },
    },
  }));
  return reqFeildProducts;
};

export const getProductByCategory = ({ categoryName = 'All Categories' }) => {};

export const getFilteredProducts = async ({
  categoryIncluded = 'All Categories',
  collectionName,
  subCategory = false, //sub category must be false or string
  attributeNames,
  attributeValues,
  operator,
  pagination = false,
  pageNumber = 1,
  pageSize = 15,
}) => {
  const listToIgnore = ['colour', 'color'];
  const searchedTexts = attributeValues.filter((element) => {
    if (typeof element === 'string' && element.length > 0)
      return !listToIgnore.includes(element.toLowerCase());
    else return '';
  });
  function generateQuery(listOfAttributeNames, listOfAttributeValues, ops) {
    //ops stands for operator
    let query = '';
    let index = 0;
    for (let i = 0; i < listOfAttributeNames.length; i++) {
      for (let j = 0; j < listOfAttributeValues.length; j++) {
        query += `filters[$or][${index}][${listOfAttributeNames[i]}][${ops}]=${listOfAttributeValues[j]}&`;
        index++;
      }
    }
    return query;
  }

  let filterUrl = `${process.env.NEXT_PUBLIC_WEBSITE}/api/products?populate[color_and_size_variants][populate]=*&populate[cover_image][populate]=*&filters[${collectionName}][${attributeNames[0]}][${operator}]=${attributeValues[0]}&pagination[page]=${pageNumber}&pagination[pageSize]=${pageSize}&sort[0]=createdAt%3Adesc`;
  if (subCategory) {
    filterUrl = `${process.env.NEXT_PUBLIC_WEBSITE}/api/products?populate[color_and_size_variants][populate]=*&populate[cover_image][populate]=*&filters[$and][0][${collectionName}][${attributeNames[0]}][${operator}]=${attributeValues[0]}&filters[$and][1][sub_category][name][${operator}]=${subCategory}&pagination[page]=${pageNumber}&pagination[pageSize]=${pageSize}&sort[0]=createdAt%3Adesc`;
    console.warn('We got sub category', filterUrl);
  }

  if (collectionName === 'products') {
    filterUrl = `${
      process.env.NEXT_PUBLIC_WEBSITE
    }/api/products?populate[color_and_size_variants][populate]=*&populate[category][populate]=*&populate[sub_category][populate]=*&populate[cover_image][populate]=*&${generateQuery(
      attributeNames,
      searchedTexts,
      operator
    )}pagination[page]=${pageNumber}&pagination[pageSize]=${pageSize}&sort[0]=createdAt%3Adesc`;

    if (categoryIncluded !== 'All Categories') {
      //
      filterUrl = `${
        process.env.NEXT_PUBLIC_WEBSITE
      }/api/products?populate[color_and_size_variants][populate]=*&populate[category][populate]=*&populate[sub_category][populate]=*&populate[cover_image][populate]=*&${generateQuery(
        attributeNames,
        searchedTexts,
        operator
      )}pagination[page]=${pageNumber}&filters[$and][1][category][name][$containsi]=${categoryIncluded}&pagination[pageSize]=${pageSize}&sort[0]=createdAt%3Adesc`;
    }
  }

  try {
    const products_config = {
      method: 'get',
      url: filterUrl,
    };

    const result = await axios(products_config);

    const filteredProduct = result.data.data;
    if (pagination) {
      // //console.log('filterUrl❤️❤️❤️❤️', result.data.data.length);
      return result.data;
    }
    return filteredProduct;
  } catch (error) {
    //console.log('Fetching  filtered Product error', error);
    return null;
  }
};

export const mapToSliderImages = (arrayOfImages) => {
  return arrayOfImages.map((image) => {
    return {
      url: `${image.attributes.url}`,
      altText: image.attributes.alternativeText,
    };
  });
};

export const getCoverImageUrl = (product) => {
  return `${product.attributes.cover_image.data.attributes.url}`;
};

export const getThemeColor = (themeName, hover = 0) => {
  let color = 'bg-gray-100';
  if (themeName.toUpperCase() === 'MALE') {
    color = 'bg-gray-100';
  } else if (themeName.toUpperCase() === 'FEMALE') {
    color = 'bg-rose-100';
  } else if (themeName.toUpperCase() === 'KIDS') {
    color = 'bg-[#C8E6C9]';
  } else {
    color = 'bg-orange-100';
  }

  if (hover !== 0) {
    const result = `hover:${color}`;
    // //console.log("result",result)
    // return 'hover:bg-rose-100';
    return result;
  } else {
    return color;
  }
};
