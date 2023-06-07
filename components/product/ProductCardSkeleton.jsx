import React from 'react'

const ProductCardSkeleton = ({collection = true}) => {
  return (
    <div
    className={`w-full flex items-center flex-col rounded-lg p-4 transition-colors bg-gradient-to-br from-gray-300 to-gray-100 animate-pulse    md:h-[350px] lg:h-[400px] ${collection ? 'h-44' : 'h-[350px]'}`}
    />
  )
}

export default ProductCardSkeleton