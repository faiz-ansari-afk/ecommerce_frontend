import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { getAboutUspageData } from '@/utils/controller/homepageController';
import {
  Instagram,
  LinkedIn,
  Facebook,
  Email,
  Whatsapp,
} from '@/components/Icon';
import parse from 'html-react-parser';

const AboutUs = ({ aboutUsData }) => {
  //console.log('aboutUsData', aboutUsData);
  const { hero_image, hero_title, hero_description } = aboutUsData.attributes;
  const { description_para_one, description_para_two, description_para_three } =
    aboutUsData.attributes;
  const {
    admin_one_image,
    admin_one_details,
    admin_two_image,
    admin_two_details,
  } = aboutUsData.attributes;
  return (
    <>
      <Head>
        <title>About Us - Ijazat</title>
      </Head>
      <main className="py-20  lg:py-32 ">
        <h3 className="font-[GillSans] uppercase text-center text-gray-500 text-xl">
          Our philosophy
        </h3>
        <h1 className="font-[TiemposFine] text-5xl font-extralight text-gray-800 my-10 text-center">
          Ye Aaraam ka Maamla hai
        </h1>
        <section className="grid lg:grid-cols-3 gap-5 my-24 md:grid-cols-2 grid-cols-1 px-5 lg:px-10">
          {description_para_one && (
            <div className="">
              <p className="text-center md:text-left   text-lg mb-4 md:pr-10 text-slate-600">
                {parse(description_para_one)}
              </p>
            </div>
          )}
          {description_para_two && (
            <div className="">
              <p className="text-center md:text-left   text-lg mb-4 md:pr-10 text-slate-600">
                {parse(description_para_two)}
              </p>
            </div>
          )}
          {description_para_three && (
            <div className="">
              <p className="text-center md:text-left   text-lg mb-4 md:pr-10 text-slate-600">
                {parse(description_para_three)}
              </p>
            </div>
          )}

          {/* Connect with us on social media platforms such as Instagram,
              LinkedIn, WhatsApp, and email to stay updated with our latest
              offerings and promotions. */}
        </section>
        <section>
          <div className="grid lg:grid-cols-2 grid-cols-1 items-center justify-between">
            <div className="w-full h-[40vh] md:h-[50vh] lg:h-screen border relative">
              <Image
                src={`${hero_image.data.attributes.url}`}
                alt="About us image"
                fill
                sizes="(max-width: 768px) 100vw,
                              (max-width: 1200px) 50vw,
                              33vw"
              />
            </div>
            <div className="w-full h-[70vh] md:h-[50vh] lg:h-screen flex items-end lg:p-12 py-12 px-4  bg-[#e3d9c6]">
              <div className="">
                <h3 className="lg:text-md text-xl font-[GillSans] my-8 uppercase">
                  {hero_title}
                </h3>
                <p className="text-xl md:text-3xl tracking-widest mb-4 italic text-gray-800">
                  {parse(hero_description)}
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="my-32">
          <p className="text-center text-gray-700 text-xl uppercase font-[GillSans] my-24">
            Run By
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:mx-32 gap-3">
            <div className="flex flex-col space-y-4 bg-gray-100 border hover:shadow-lg lg:mx-12 mx-4 rounded-lg py-12 items-center">
              <div className="relative h-32 w-32 rounded-full">
                <Image
                  src={`${admin_one_image.data.attributes.url}`}
                  alt="About us image"
                  fill
                  sizes="(max-width: 768px) 100vw,
                                    (max-width: 1200px) 50vw,
                                    33vw"
                  className="rounded-full"
                />
              </div>
              <div className="flex flex-col items-center">
                <p className="text-md">{admin_one_details.name}</p>
                <p className="text-sm text-gray-500">
                  {admin_one_details.about}
                </p>
              </div>
              <div className="flex gap-2 bg-slate-900 p-2 items-center rounded-lg">
                {admin_one_details.instagram ? (
                  <button className="h-5 w-5 text-gray-300 hover:text-white ">
                    <Instagram />
                  </button>
                ) : null}
                {admin_one_details.facebook ? (
                  <button className="h-5 w-5 text-gray-300 hover:text-white ">
                    <Facebook />
                  </button>
                ) : null}
                {admin_one_details.whatsapp ? (
                  <button className="h-5 w-5 text-gray-300 hover:text-white ">
                    <Whatsapp />
                  </button>
                ) : null}
                {admin_one_details.linkedIn ? (
                  <button className="h-5 w-5 text-gray-300 hover:text-white ">
                    <LinkedIn />
                  </button>
                ) : null}
                {admin_one_details.email ? (
                  <button className="h-5 w-5 text-gray-300 hover:text-white">
                    <Email />
                  </button>
                ) : null}
              </div>
            </div>

            <div className="flex flex-col space-y-4 bg-gray-100 border hover:shadow-lg lg:mx-12 mx-4 rounded-lg py-12 items-center">
              <div className="relative h-32 w-32 rounded-full">
                <Image
                  src={`${admin_two_image.data.attributes.url}`}
                  alt="About us image"
                  fill
                  sizes="(max-width: 768px) 100vw,
                                    (max-width: 1200px) 50vw,
                                    33vw"
                  className="rounded-full"
                />
              </div>
              <div className="flex flex-col items-center">
                <p className="text-md">{admin_two_details.name}</p>
                <p className="text-sm text-gray-500">
                  {admin_two_details.about}
                </p>
              </div>
              <div className="flex gap-2 bg-slate-900 p-2 items-center rounded-lg">
                {admin_two_details.instagram ? (
                  <button className="h-5 w-5 text-gray-300 hover:text-white ">
                    <Instagram />
                  </button>
                ) : null}
                {admin_two_details.facebook ? (
                  <button className="h-5 w-5 text-gray-300 hover:text-white ">
                    <Facebook />
                  </button>
                ) : null}
                {admin_two_details.whatsapp ? (
                  <button className="h-5 w-5 text-gray-300 hover:text-white ">
                    <Whatsapp />
                  </button>
                ) : null}
                {admin_two_details.linkedIn ? (
                  <button className="h-5 w-5 text-gray-300 hover:text-white ">
                    <LinkedIn />
                  </button>
                ) : null}
                {admin_two_details.email ? (
                  <button className="h-5 w-5 text-gray-300 hover:text-white">
                    <Email />
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default AboutUs;
export async function getServerSideProps(ctx) {
  const aboutUsData = await getAboutUspageData();

  return { props: { aboutUsData } };
}
