import React from 'react';

const ShippingMethod = ({ setContinueToPayment, continueToPayment }) => {
  if (continueToPayment) {
    return (
      <div className="mt-12">
        <h3 className="my-12 text-3xl text-gray-500">Shipping method</h3>
        <h5 className="pb-2 text-sm text-gray-500">Method</h5>
        <ul className="font-[SangbleuSans] text-sm text-gray-900">
          <li>Worldwide (DAP) (₹ 00.00)</li>
        </ul>

        <button
          className="my-6 underline underline-offset-4"
          onClick={() => setContinueToPayment(false)}
        >
          Edit
        </button>
      </div>
    );
  }
  return (
    <div>
      <h3 className="py-6 font-[SangbleuSans] text-3xl">Shipping method</h3>
      <ul className="space-y-3">
        <li className="rounded-lg bg-orange-100">
          <div className="flex items-center rounded  pl-4 ">
            <input
              defaultChecked
              id="bordered-radio-2"
              type="radio"
              value=""
              name="bordered-radio"
              className="h-4 w-4 "
            />
            <label
              htmlFor="bordered-radio-2"
              className="ml-2  w-full p-4 text-gray-900"
            >
              <div className="flex">
                <div className="flex-grow">Worldwide Shipping (DAP)</div>{' '}
                <div className="text-right ">₹ 00.00</div>
              </div>
            </label>
          </div>
        </li>
      </ul>
      <div className="text-center md:text-left">
        <button
          className="mt-12 w-fit rounded-full bg-black px-12  py-2 font-[SangbleuSans] text-xl font-light text-white hover:shadow-lg md:px-24"
          onClick={() => setContinueToPayment(true)}
        >
          Continue to payment method
        </button>
      </div>
    </div>
  );
};

export default ShippingMethod;
