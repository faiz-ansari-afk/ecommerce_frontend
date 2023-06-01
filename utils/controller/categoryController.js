import axios from 'axios';

export const getCategories = async (getNameOnly = false) => {
  try {
    const config = {
      method: 'get',
      url: `${process.env.NEXT_PUBLIC_WEBSITE}/api/categories?populate=*`,
    };

    const result = await axios(config);

    const data = result.data.data;
    if (getNameOnly) {
      const categories = data.map((category) => category.attributes.name);
      return categories;
    }
    return data;
  } catch (error) {
    ////////console.log(error);
    return null;
  }
};

export const mapToModelViewCategory = async () => {
  const categories = await getCategories();

  const raw1 = categories?.map((category) => {
    const { name, images: imagesRaw, sub_categories } = category.attributes;

    const images = imagesRaw.data.map((image) => {
      return {
        url: `${image.attributes.url}`,
        altText: image.attributes.alternativeText,
      };
    });

    const subCategories = sub_categories.data.map((sub) => {
      return { name: sub.attributes.name };
    });

    return {
      name,
      images,
      subCategories,
    };
  });
  return raw1;
};
