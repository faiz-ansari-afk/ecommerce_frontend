import Head from 'next/head';
import { mapToModelViewCategory } from '@/utils/controller/categoryController';
import BrowseCategories from '@/components/BrowseCategories';
import ProductsGallery from '@/components/Homepage/ProductsGallery';
import { getHomepageData } from '@/utils/controller/homepageController';
import { ClassifyHero } from '@/components/Homepage';
import { getFilteredProducts } from '@/utils/controller/productController';
// import styles from '@/components/Homepage/ProductGallery.module.css'
export default function Home({ homepage, categories, products }) {
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
      <main className="container mx-auto">
        {homepage.attributes.FIRST_HERO && (
          <ClassifyHero hero={homepage.attributes.FIRST_HERO} />
        )}
        {/* <div className={`${styles.bgRipple}`}> */}
        <ProductsGallery products={products} />
        {/* </div> */}
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
  const products = await getFilteredProducts({
    collectionName: 'category',
    attributeNames: ['name'],
    attributeValues: [''],
    operator: '$contains',
    pagination: false,
    pageNumber: 1,
    pageSize: 15,
  });
  return {
    props: {
      homepage: homepage || null,
      categories: categoriesDetails || null,
      products: products || null,
    },
  };
}
