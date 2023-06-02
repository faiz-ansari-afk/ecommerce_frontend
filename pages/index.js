import Head from 'next/head';
import { mapToModelViewCategory } from '@/utils/controller/categoryController';
import BrowseCategories from '@/components/BrowseCategories';
import { getHomepageData } from '@/utils/controller/homepageController';
import { ClassifyHero } from '@/components/Homepage';

export default function Home({ homepage, categories }) {
  return (
    <>
      <Head>
        <title>Homepage - Sadak Chaap</title>
        <meta
          name="description"
          content="Shop local in Bhiwandi with our ecommerce website. Browse and buy from a variety of products with ease. Visit us today!"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="microphone" content="true" />
      </Head>
      <main className="">
        {homepage.attributes.FIRST_HERO && (
          <ClassifyHero hero={homepage.attributes.FIRST_HERO} />
        )}

        {homepage.attributes.SECOND_HERO && (
          <ClassifyHero hero={homepage.attributes.SECOND_HERO} />
        )}
        {categories && (
          <section className=" py-20 lg:py-24 ">
            <BrowseCategories categories={categories} />
          </section>
        )}

        {homepage.attributes.THIRD_HERO && (
          <ClassifyHero hero={homepage.attributes.THIRD_HERO} />
        )}
      </main>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const homepage = await getHomepageData();
  const categoriesDetails = await mapToModelViewCategory();

  return { props: { homepage, categories: categoriesDetails } };
}
