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
        <title>Contact - Bhiwandi Ali Baba</title>
      </Head>
      <section className="py-32 px-5 md:py-64 md:px-10">
        <div>
          <h1
            className={`mb-4 text-center font-heading text-5xl font-extralight  tracking-wide text-gray-900 lg:mb-8 lg:text-8xl`}
          >
            Contact
          </h1>
          <p className="mx-auto mb-4  text-center text-lg font-light text-gray-600 lg:mb-8 lg:text-xl">
            Do you want to know more regarding Ali Baba (Bhiwandi) or our products? We’d be
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
        <div className="mt-36 hidden md:block">
          <h3 className="text-center text-7xl font-extralight text-gray-800">
            Bhiwandi Ali Baba Partners Brand Stores & <br /> Showrooms
          </h3>
          <div className=" p-8">
            <Slider perView={2.5} space={30} navigation={false}>
              {imageSlider.map((img) => (
                <div className="aspect-[9/12] cursor-pointer" key={img.url}>
                  <Image src={img.url} fill alt="store location images" />
                </div>
              ))}
            </Slider>
          </div>
        </div>

        <div className="shop-location-container mt-32">
          <h2 className="text-center tracking-widest text-7xl">Ali Baba</h2>
          <h4 className="text-center tracking-wide text-3xl text-gray-400 font-extralight">
            Bhiwandi
          </h4>

          {/* shop locations collapsible mobile version */}
          <div className="flex flex-col items-center mt-12 md:hidden">
            {locationOfShops.map((shop) => (
              <div
                className="mb-3 max-w-[468px] min-w-[300px]"
                key={shop.title}
              >
                <details className="transform-gpu rounded-lg  border-b p-6 delay-75 duration-100 ease-in-out open:bg-white open:shadow-lg open:ring-1 open:ring-black/5 hover:shadow-lg ">
                  <summary className="select-none font-semibold leading-6 text-slate-900 cursor-pointer ">
                    {shop.title}
                  </summary>
                  <div className="mt-3  leading-6 text-slate-700 ">
                    <ul>
                      <li className="flex gap-2 mt-4 items-center">
                        <div className="w-3 h-3 mr-2">
                          {' '}
                          <Location />
                        </div>
                        <div>
                          {shop.city} <br /> {shop.streets}
                        </div>
                      </li>
                      <li className="flex gap-2 mt-4 items-center">
                        <div className="w-3 h-3 mr-2">
                          {' '}
                          <Phone />
                        </div>
                        <div>{shop.phone}</div>
                      </li>
                      <li className="flex gap-2 mt-4 items-center">
                        <div className="w-3 h-3 mr-2">
                          {' '}
                          <Email />
                        </div>
                        <div>{shop.email}</div>
                      </li>
                    </ul>
                    <div className="button-transition  max-w-[180px]  mt-4 flex justify-center items-center">
                      <div className="h-4 w-4">
                        <Direction />
                      </div>
                      <div className="">Get Direction</div>
                    </div>
                  </div>
                </details>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 mt-12 md:grid hidden px-12">
            {locationOfShops.map((shop) => (
              <div
                className="mb-3 max-w-[468px] min-w-[300px]"
                key={shop.title}
              >
                <div className="p-6  ">
                  <h3 className="select-none font-semibold leading-6 text-slate-900 cursor-pointer ">
                    {shop.title}
                  </h3>
                  <div className="mt-3  leading-6 text-slate-700 ">
                    <ul>
                      <li className="flex gap-2 mt-4 items-center">
                        <div className="w-3 h-3 mr-2">
                          {' '}
                          <Location />
                        </div>
                        <div>
                          {shop.city} <br /> {shop.streets}
                        </div>
                      </li>
                      <li className="flex gap-2 mt-4 items-center">
                        <div className="w-3 h-3 mr-2">
                          {' '}
                          <Phone />
                        </div>
                        <div>{shop.phone}</div>
                      </li>
                      <li className="flex gap-2 mt-4 items-center">
                        <div className="w-3 h-3 mr-2">
                          {' '}
                          <Email />
                        </div>
                        <div>{shop.email}</div>
                      </li>
                    </ul>
                    <div className="button-transition  max-w-[180px]  mt-4 flex justify-center items-center">
                      <div className="h-4 w-4">
                        <Direction />
                      </div>
                      <div className="">Get Direction</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default contact;
