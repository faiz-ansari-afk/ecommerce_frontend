import React from 'react';

function Pagination({ currentPage, totalPages, onPageChange }) {
  const productsPerPage = 15;
  const pages = [];
  const startIndex = 0;
  const endIndex = totalPages;

  for (let i = startIndex + 1; i <= endIndex; i++) {
    pages.push(
      <button
        key={i}
        onClick={() => {
          onPageChange(i);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`px-3 py-1 flex justify-center ${
          currentPage === i
            ? 'bg-black text-white shadow-lg'
            : 'bg-white text-black border hover:shadow-lg'
        } rounded-lg mr-2 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-opacity-50`}
      >
        {i}
      </button>
    );
  }

  return (
    <div className="flex justify-center mt-8 mb-32">
      <div className="flex rounded-md">
        <button
          onClick={() => {
            onPageChange(currentPage - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`px-3 py-1 rounded-l-md mr-2 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-opacity-50 ${
            !(currentPage > 1)
              ? 'bg-gray-100 text-gray-500'
              : 'bg-black text-white'
          }`}
          disabled={!(currentPage > 1)}
        >
          Prev
        </button>
        {pages}
        <button
          onClick={() => {
            onPageChange(currentPage + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`px-3 py-1   rounded-r-md ml-2 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-opacity-50 ${
            !(currentPage < totalPages)
              ? 'bg-gray-100 text-gray-500'
              : 'bg-black text-white'
          }`}
          disabled={!(currentPage < totalPages)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Pagination;
