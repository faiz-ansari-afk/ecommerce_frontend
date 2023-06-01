import { useEffect, useState } from 'react';
import Image from 'next/image';

function Variants({
  product,
  setOpenVariants,
  setPriceBasedOnVariants,
  setSelectedVariantImage,
  setSelectedVariantDetails,
  selectedColorID,
  setSelectedColorID,
  selectedSizeID,
  setSelectedSizeID,
}) {
  const { color_and_size_variants } = product.attributes;
  const [isSizeAvailable, setIsSizeAvailable] = useState(false);
  useEffect(() => {
    color_and_size_variants.forEach((csv) => {
      if (csv.size_and_price.length > 0) {
        setIsSizeAvailable(true);
      }
    });
  }, []);

  useEffect(() => {
    if (isSizeAvailable) {
      if (selectedColorID && selectedSizeID) {
        const foundVariant = color_and_size_variants.find(
          (csv) => csv.id === selectedColorID
        );
        if (foundVariant) {
          const {
            id,
            color,
            price: base_price,
            image,
            size_and_price,
          } = foundVariant;
          const foundSizenPrice = size_and_price.find(
            (item) => item.id === selectedSizeID
          );
          if (size_and_price.length > 0) {
            if (foundSizenPrice) {
              const { id: sid, sizes, price } = foundSizenPrice;
              const output = {
                name: product.attributes.name,
                id: product.id,
                colorID: id,
                color,
                price: base_price,
                image: `${image.data.attributes.url}`,
                size_and_price: { id: sid, sizes, price },
              };
              // ////console.log(output);
              setSelectedVariantDetails(output);
            } else {
              // ////console.log('No item found with given sid');
              setSelectedVariantDetails(null);
            }
          }
        } else {
          // ////console.log('No item found with given pid');
          setSelectedVariantDetails(null);
        }
      } else {
        // ////console.log('No item found with that cid');
        setSelectedVariantDetails(null);
      }
    } else {
      if (selectedColorID) {
        const foundVariant = color_and_size_variants.find(
          (csv) => csv.id === selectedColorID
        );
        if (foundVariant) {
          const { id, color, price, image, size_and_price } = foundVariant;
          const foundSizenPrice = size_and_price.find(
            (item) => item.id === selectedSizeID
          );
          const outputWithoutSize = {
            name: product.attributes.name,
            id: product.id,
            colorID: id,
            color,
            price,
            image: `${image.data.attributes.url}`,
          };
          setSelectedVariantDetails(outputWithoutSize);
          // ////console.log(outputWithoutSize);
        } else {
          // ////console.log('No item found with that cid');
          setSelectedVariantDetails(null);
        }
      } else {
        // ////console.log('No item found with that cid');
        setSelectedVariantDetails(null);
      }
    }
  }, [selectedColorID, selectedSizeID]);

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
          {color_and_size_variants.map((v, i) => {
            const imgURL = `${v.image.data.attributes.url}`;
            const altText = `${v.image.data.attributes.alternativeText}`;
            return (
              <div
                key={i}
                className={`mx-2 flex-shrink-0  cursor-pointer hover:scale-[1.1] rounded p-2 border relative h-24 w-24 lg:h-28 lg:w-28 
                  ${
                    selectedColorID === v.id
                      ? 'border-2 border-black scale-[1.1]'
                      : ''
                  }
                  `}
                onClick={() => {
                  setSelectedVariantImage(imgURL);
                  setSelectedColorID(v.id);
                  setSelectedSizeID(null);
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
        {selectedColorID &&
          color_and_size_variants.map((colorVariant, index) => {
            if (selectedColorID === colorVariant.id) {
              // ////console.log(colorVariant)
              if (colorVariant.size_and_price.length === 0) return null;
              // <p key={index} className='border px-3 ml-1 inline-block rounded-full border-rose-600 bg-rose-400 text-gray-900'>No size available 🥲</p>
              else {
                // isSizeAvailable = true;
                const mappedSizes = colorVariant.size_and_price.map(
                  (spv, ind) => {
                    return (
                      <span
                        key={`${ind}-${spv.sizes}`}
                        className={`cursor-pointer border rounded-full px-3 py-2  m-2 inline-block  ${
                          selectedSizeID === spv.id
                            ? 'text-white bg-black border-white'
                            : ''
                        }`}
                        onClick={() => {
                          setPriceBasedOnVariants(spv.price);
                          setSelectedSizeID(spv.id);
                        }}
                      >
                        {spv.sizes.replace('i', '')}
                      </span>
                    );
                  }
                );

                return mappedSizes;
              }
            }
            return null;
          })}
        {/*  */}
      </div>
    </div>
  );
}
export default Variants;
