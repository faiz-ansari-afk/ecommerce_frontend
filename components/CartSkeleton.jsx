import React from 'react'

const CartSkeleton = () => {
  return (
    
<div  className="max-w-full md:px-16 md:mx-8 mt-32 space-y-4 border-t border-gray-200 divide-y divide-gray-200  animate-pulse  p-6 ">
    <div className="flex items-center justify-between">
        <div className='flex gap-6'>
            <div className="h-24 bg-gray-300   w-24 mb-2.5"></div>
            <div>
            <div className="h-2.5 bg-gray-300 rounded-full  w-24 mb-2.5"></div>
            <div className="w-32 h-2 bg-gray-200 rounded-full "></div></div>
        </div>
        <div className="h-2.5 bg-gray-300 rounded-full  w-12"></div>
    </div>
    <div className="flex items-center justify-between pt-4">
        <div className='flex gap-6'>
            <div className="h-24 bg-gray-300   w-24 mb-2.5"></div>
            <div>
            <div className="h-2.5 bg-gray-300 rounded-full  w-24 mb-2.5"></div>
            <div className="w-32 h-2 bg-gray-200 rounded-full "></div></div>
        </div>
        <div className="h-2.5 bg-gray-300 rounded-full  w-12"></div>
    </div>
    <div className="flex items-center justify-between pt-4">
        <div className='flex gap-6'>
            <div className="h-24 bg-gray-300   w-24 mb-2.5"></div>
            <div>
            <div className="h-2.5 bg-gray-300 rounded-full  w-24 mb-2.5"></div>
            <div className="w-32 h-2 bg-gray-200 rounded-full "></div></div>
        </div>
        <div className="h-2.5 bg-gray-300 rounded-full  w-12"></div>
    </div>
    <span className="sr-only">Loading...</span>
</div>

  )
}

export default CartSkeleton