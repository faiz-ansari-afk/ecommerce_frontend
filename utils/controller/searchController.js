export const searchProducts = (searchQuery, products) => {
  const searchKeywords = searchQuery.trim().split(' ');
  const searchRegex = new RegExp(searchKeywords.join('|'), 'gi');
  const filteredProducts = products.filter((product) => {
    const productString = `${product.attributes.name} ${product.attributes.description} ${product.attributes?.search_text}`;
    return productString.match(searchRegex);
  });
  return filteredProducts;
};

export const deepSearchProducts = ({ searchQuery, category, products }) => {
  const searchKeywords = searchQuery.trim().split(' ');
  const searchRegex = new RegExp(searchKeywords.join('|'), 'gi');
  const filteredProducts = products.filter((product) => {
    const productString = `${product.attributes.name} ${product.attributes.description} ${product.attributes?.search_text}`;
    return productString.match(searchRegex);
  });

  if (filteredProducts.length < 1 && category === 'All Categories') {
    return {
      message: 'Oops!, No product available',
      products: null,
      requestProduct: true,
    };
  }
  if (filteredProducts.length < 1 && category !== 'All Categories') {
    return {
      message: `No product found with that keyword, you can find ${category} products below`,
      products: products.filter(
        (product) =>
          category === product.attributes.category.data.attributes.name
      ),
    };
  }

  if (filteredProducts.length > 0 && category !== 'All Categories') {
    const filterByCategory = filteredProducts.filter(
      (product) => category === product.attributes.category.data.attributes.name
    );
    if (filterByCategory.length < 1) {
      return {
        message: `Oops! ${searchQuery} is not available in ${category}.`,
        products: null,
      };
    }
    return {
      message: `Yayy! ${filterByCategory.length} ${
        filteredProducts.length === 1 ? 'product' : 'products'
      } found.`,
      products: filterByCategory,
    };
  }
  return {
    message: `Yayy! ${filteredProducts.length} ${
      filteredProducts.length === 1 ? 'product' : 'products'
    } found.`,
    products: filteredProducts,
  };
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
