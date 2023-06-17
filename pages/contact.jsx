import Head from 'next/head';
import Image from 'next/image';
import { Playfair_Display } from '@next/font/google';
import { Email, Chat, Phone, Location, Direction } from '@/components/Icon';
import { Slider } from '@/components/Slider';

const contact = () => {
  const imageSlider = [
    {
      url: 'https://cdn.moooi.com/tmp/image-thumbnails/Applied/Brand-stores%20Showrooms/Amsterdam-Brandstore/2022/Utrechtsestraat/image-thumb__62489__collection_landscape_2x/Moooi-Utrechtsestraat-Full-Facade.webp',
    },
    {
      url: 'https://cdn.moooi.com/tmp/image-thumbnails/Applied/Brand-stores%20Showrooms/New-York-Brandstore/2019/image-thumb__15365__collection_landscape/BFF_Sofa_by_Macel_Wanders_New_York_Showroom.webp',
    },
    {
      url: 'https://cdn.moooi.com/tmp/image-thumbnails/Applied/Brand-stores%20Showrooms/London-Showroom/2019/image-thumb__15352__collection_landscape/Moooi-London-Showroom-2019-8.webp',
    },
    {
      url: 'https://cdn.moooi.com/tmp/image-thumbnails/Applied/Brand-stores%20Showrooms/Stockholm-Showroom/2020/image-thumb__15421__collection_landscape/moooi-monster-table-monster-chairs-detail.webp',
    },
    {
      url: 'https://cdn.moooi.com/tmp/image-thumbnails/Applied/Brand-stores%20Showrooms/The-Hague/image-thumb__38399__collection_landscape/Moooi-Store-The-Hague-Facade.webp',
    },
    {
      url: 'https://cdn.moooi.com/tmp/image-thumbnails/Applied/Brand-stores%20Showrooms/New-York-Brandstore/2019/image-thumb__15371__collection_landscape/Liberty_Table_Plant_Chandelier.webp',
    },
  ];
  const locationOfShops = [
    {
      title: 'Uzibma',
      city: 'Bhiwandi',
      streets: 'Qaiser Baugh',
      phone: '+91 9876543210',
      email: 'info@b1dalibaba.com',
    },
    {
      title: 'Solanki Sofa',
      city: 'Bhiwandi',
      streets: 'At turn to Qaiser Baugh',
      phone: '+91 9876543210',
      email: 'info@b1dalibaba.com',
    },
    {
      title: 'Ameer Shoes Shop',
      city: 'Bhiwandi',
      streets: 'Khadipar, khooni Gaww',
      phone: '+91 9876543210',
      email: 'info@b1dalibaba.com',
    },
    {
      title: 'Shoeb Burqa House',
      city: 'Bhiwandi',
      streets: 'Lala Shoping, 4th floor.',
      phone: '+91 9876543210',
      email: 'info@b1dalibaba.com',
    },
  ];
  return (
    <>
      <Head>
        <title>Contact - Bhiwandi Are Baba</title>
      </Head>
      <section className="py-32 px-5 md:py-64 md:px-10">
        <div>
          <h1
            className={`mb-4 text-center font-heading text-5xl font-extralight  tracking-wide text-gray-900 lg:mb-8 lg:text-8xl`}
          >
            Contact
          </h1>
          <p className="mx-auto mb-4  text-center text-lg font-light text-gray-600 lg:mb-8 lg:text-xl">
            Do you want to know more regarding Are Baba (Bhiwandi) or our products? We’d be
            happy to hear from you!
          </p>
        </div>

        <div className="mx-auto">
          <div className="flex flex-col items-center justify-center gap-5 md:flex-row ">
            <div className="flex justify-center  md:justify-end">
              <div className="button-transition">
                <div className="h-5 w-5">
                  <Phone />
                </div>
                <div className="">Give us a call</div>
              </div>
            </div>

            <div className="flex justify-center md:justify-center">
              <div className="button-transition">
                <div className="h-5 w-5">
                  <Email />
                </div>
                <div className="">Send us an e-mail</div>
              </div>
            </div>
            <div className="flex justify-center md:justify-start">
              <div className="button-transition">
                <div className="h-5 w-5">
                  <Chat />
                </div>
                <div className="">Chat with us</div>
              </div>
            </div>
          </div>
        </div>
        

        <div className="shop-location-container mt-32">
          <h2 className="text-center tracking-widest text-7xl">Are Baba</h2>
          <h4 className="text-center tracking-wide text-3xl text-gray-400 font-extralight">
            Bhiwandi
          </h4>


          
        </div>
      </section>
    </>
  );
};

export default contact;
