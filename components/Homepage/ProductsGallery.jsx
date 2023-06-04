import React from 'react'

const ProductsGallery = () => {
  return (
    <div className="h-screen">
   <div className="grid grid-cols-2 md:grid-cols-3 grid-rows-3 md:grid-rows-4 gap-4 h-5/6 w-4/5 mx-auto">
      <div className="bg-indigo-100 row-span-1 md:row-span-2">
         <span>01</span>
      </div>
      <div className="bg-red-100 col-span-1 md:col-span-2">
         <span>02</span>
      </div>
      <div className="bg-purple-100">
         <span>03</span>
      </div>
      <div className="bg-violet-100 row-span-1 md:row-span-2">
         <span>04</span>
      </div>
      <div className="bg-sky-100 row-span-1 md:row-span-2 col-span-1 md:col-span-2">
         <span>05</span>
      </div>
      <div className="bg-emerald-100">
         <span>06</span>
      </div>
   </div>
</div>
  )
}

export default ProductsGallery