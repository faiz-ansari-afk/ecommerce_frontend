import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';

function BurqaSwatch({
  product,
  setOpenVariants,
  setPriceBasedOnVariants,
  setSelectedVariantImage,
  setSelectedVariantDetails,
}) {
  const color_variants = product.attributes.color_variants;

  const [active, setActive] = useState(null);
  const [selectedColorID, setSelectedColorID] = useState(null);
  const [selectedVariantID, setSelectedVariantID] = useState(null);

  const [selectedVariantData, setSelectedVariantData] = useState({
    productID: product.id,
    name: product.attributes.name,
    category: product.attributes.category.data.attributes.name,
    color: null,
    base_price: null,
    image: null,
  });

  useEffect(() => {
    product.attributes.color_variants.forEach((cv) => {
      if (selectedColorID) {
        if (selectedColorID === cv.id) {
          setSelectedVariantData((ov) => {
            return {
              ...ov,
              color: cv.color,
              base_price: cv.price,
              image: `${cv.image.data.attributes.url}`,
            };
          });
          
        }
      }
    });
  }, [selectedColorID]);
  
  useEffect(()=>{
    setSelectedVariantDetails(selectedVariantData);
  },[selectedVariantData])
  // //////console.log('selected burqa details swatch', selectedVariantData);

  return (
    <div className="border-t border-black ">
      <div className="flex mt-3">
        <h3 className="inline-block flex-grow underline uppercase font-light text-gray-800 ">
          Choose color
        </h3>
        <button
          onClick={() => {
            // setButtonName('Choose Variant');
            setOpenVariants(false);
          }}
          className="rounded-lg cursor-pointer hover:scale-[1.1] hover:shadow-lg border-black border px-2 mr-1"
        >
          X
        </button>
      </div>
      <div className="my-3  ">
        <div className="flex gap-4 overflow-x-scroll md:overflow-x-auto py-3  ">
          {color_variants.map((v, i) => {
            const imgURL = `${v.image.data.attributes.url}`;
            // //////console.log("burqa img url", product)
            const altText = `${v.image.data.attributes.alternativeText}`;
            return (
              <div
                className={`mx-2 flex-shrink-0  cursor-pointer hover:scale-[1.1]  p-2 border relative h-24 w-24 lg:h-28 lg:w-28  rounded-lg
                ${
                  selectedColorID === v.id
                    ? 'border-2 border-black scale-[1.1]'
                    : ''
                }
                `}
                key={v.id}
                onClick={() => {
                  //////console.log('burqa img', imgURL);
                  setSelectedVariantImage(imgURL);
                  setSelectedColorID(v.id);
                  setPriceBasedOnVariants(v.price);
                  setSelectedVariantID(null);
                }}
              >
                <Image
                  src={imgURL}
                  alt={altText}
                  fill
                  sizes="(max-width: 768px) 100vw,
                      (max-width: 1200px) 50vw,
                      33vw"
                  className="h-full rounded-lg w-full object-fit"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default BurqaSwatch;
