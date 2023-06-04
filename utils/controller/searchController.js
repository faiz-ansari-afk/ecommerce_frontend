import axios from 'axios';

export const searchShopOrShopProducts = async ({
  searchShop = false,
  shopName,
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

  let filterUrl = `${
    process.env.NEXT_PUBLIC_WEBSITE
  }/api/products?populate[color_and_size_variants][populate]=*&populate[category][populate]=*&populate[sub_category][populate]=*&populate[cover_image][populate]=*&${generateQuery(
    attributeNames,
    searchedTexts,
    operator
  )}pagination[page]=${pageNumber}&filters[$and][1][shop][name][$containsi]=${shopName}&pagination[pageSize]=${pageSize}&sort[0]=createdAt%3Adesc`;

  if (searchShop) {
    filterUrl = `${
      process.env.NEXT_PUBLIC_WEBSITE
    }/api/shops?populate[categories][populate]=*&populate[images][populate]=*&populate[cover_image][populate]=*&populate[products][populate]=*&${generateQuery(
      attributeNames,
      searchedTexts,
      operator
    )}pagination[page]=${pageNumber}&pagination[pageSize]=${pageSize}&sort[0]=createdAt%3Adesc`;
  }
  try {
    const products_config = {
      method: 'get',
      url: filterUrl,
    };

    const result = await axios(products_config);

    const filteredProduct = result.data.data;
    if (pagination) {
      return result.data;
    }
    return filteredProduct;
  } catch (error) {
    console.log('Fetching  filtered shop Product error', error);
    return null;
  }
};

export const deepSearchShopsOrProducts = ({ searchQuery, dataSets }) => {
  const searchKeywords = searchQuery.trim().split(' ');
  const searchRegex = new RegExp(searchKeywords.join('|'), 'gi');

  const filteredData = dataSets.filter((data) => {
    const stringToMatch = `${data.attributes.name} ${data.attributes?.area} ${data.attributes?.search_text}  ${data.attributes?.description}`;
    return stringToMatch.match(searchRegex);
  });
  // //console.log("filteredData",filteredData)
  return filteredData;
};
