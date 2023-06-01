import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';

function TshirtSwatch({
  product,
  setOpenVariants,
  setPriceBasedOnVariants,
  setSelectedVariantImage,
  setSelectedVariantDetails,
}) {
  const variants = product.attributes.variants;

  const [active, setActive] = useState(null);
  const [selectedColorID, setSelectedColorID] = useState(null);
  const [selectedVariantID, setSelectedVariantID] = useState(null);

  const [selectedVariantData, setSelectedVariantData] = useState({
    productID: product.id,
    name: product.attributes.name,
    category: product.attributes.category.data.attributes.name,
    color: null,
    size: null,
    base_price: null,
    image: null,
  });

  let color = null;
  let image = null;
  let size = null;
  let base_price = null;

  useEffect(() => {
    variants.forEach((variant) => {
      if (variant.id === selectedColorID) {
        color = variant.color;
        image = `${variant.image.data.attributes.url}`;
        variant.size_and_price.forEach((sp) => {
          if (sp.id === selectedVariantID) {
            // size = sp.sizes;
            // base_price = sp.price;
            setSelectedVariantData((ov) => {
              return {
                productID: product.id,
                name: product.attributes.name,
                category: product.attributes.category.data.attributes.name,
                color: variant.color,
                image,
                size: sp.sizes.replace("i",""),
                base_price: sp.price,
              };
            });
          }
        });
      }
    });

  }, [selectedColorID, selectedVariantID]);
  useEffect(() => {
    if(selectedVariantID === null){
      setSelectedVariantDetails(null);
    }
    if (selectedColorID && selectedVariantID)
      setSelectedVariantDetails(selectedVariantData);
  }, [selectedVariantData]);
  return (
    <div className="border-t border-black ">
      <div className="flex mt-3">
        <h3 className="inline-block flex-grow underline uppercase font-light text-gray-800 ">
          Choose color
        </h3>
        <button
          onClick={() => {
            setOpenVariants(false);
          }}
          className="rounded-lg cursor-pointer hover:scale-[1.1] hover:shadow-lg border-black border px-2 mr-1"
        >
          X
        </button>
      </div>
      <div className="my-3  ">
        <div className="flex gap-4 overflow-x-scroll md:overflow-x-auto py-3  ">
          {variants.map((v, i) => {
            const imgURL = `${v.image.data.attributes.url}`;
            const altText = `${v.image.data.attributes.alternativeText}`;
            return (
              <div
                className={`mx-2 flex-shrink-0  cursor-pointer hover:scale-[1.1] rounded p-2 border relative h-24 w-24 lg:h-28 lg:w-28 
                ${
                  selectedColorID === v.id
                    ? 'border-2 border-black scale-[1.1]'
                    : ''
                }
                `}
                key={v.id}
                onClick={() => {
                  setSelectedVariantImage(imgURL);
                  setSelectedColorID(v.id);
                  setSelectedVariantData(null)
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
                  className="h-full w-full object-fit"
                />
              </div>
            );
          })}
        </div>
      </div>
 
      {/* show sizes here */}
      {selectedColorID ? (
        <div className="">
          {variants.map((v, i) => {
            if (selectedColorID === v.id)
              return (
                <div className="my-8" key={`${v.id}`}>
                  <h3 className="mb-5  font-light text-gray-800">
                    <span className="underline uppercase">Choose size</span>
                  </h3>
                  {v.size_and_price.map((sp, ind) => {
                    return (
                      <span
                        className={`cursor-pointer border rounded-full px-3 py-2 mr-3  ${
                          selectedVariantID === sp.id
                            ? 'text-white bg-black border-white'
                            : ''
                        }`}
                        key={`${ind}-${sp.sizes}`}
                        onClick={() => {
                          setPriceBasedOnVariants(sp.price);
                          setSelectedVariantID(sp.id);
                        }}
                      >
                        {sp.sizes.replace("i","")}
                      </span>
                    );
                  })}
                </div>
              );
          })}
        </div>
      ) : (
        <div className="text-md my-8 text-rose-500">Choose color first</div>
      )}
    </div>
  );
}

// export default useMemo(TshirtSwatch);
export default TshirtSwatch;
