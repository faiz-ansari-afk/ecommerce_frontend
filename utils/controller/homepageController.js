import axios from 'axios';

const homepageURL = `${process.env.NEXT_PUBLIC_WEBSITE}/api/home-page?populate[FIRST_HERO][populate]=*&populate[SECOND_HERO][populate]=*&populate[THIRD_HERO][populate]=*`;
export const getHomepageData = async () => {
  try {
    const config = {
      method: 'get',
      url: homepageURL,
    };

    // const result = await axios(config)
    const resultHomepage = await axios(config);

    const homepage = resultHomepage.data.data;
    // console.log("homepage",homepage)
    return homepage;
  } catch (error) {
    console.log('Fetching  homepage error', error);
    return null;
  }
};

export const getAboutUspageData = async () => {
  try {
    const config = {
      method: 'get',
      url: `${process.env.NEXT_PUBLIC_WEBSITE}/api/about?populate=*`,
    };

    // const result = await axios(config)
    const resultHomepage = await axios(config);

    const homepage = resultHomepage.data.data;
    return homepage;
  } catch (error) {
    ////console.log('Fetching  homepage error', error);
    return null;
  }
};
