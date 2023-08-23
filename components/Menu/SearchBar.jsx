import { useState, useEffect } from 'react';
import {
  getFilteredProducts
} from '@/utils/controller/productController';
import useSpeechRecognition from '@/utils/hooks/voiceController';

import { Menu } from '../Icon';
import { useRouter } from 'next/router';

const SearchBar = ({
  setSearchedProducts,
  setOpenSearchList,
  setQueryParam,
  setIsKeyboardOpen = null,
  queryParam
}) => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const router = useRouter();
  //____________________handle product search when user enter search keyword by keyboard_____________________
  const handleSearchBarText = (e) => {
    // e.preventDefault();
    setSearchKeyword(e.target.value);
    setQueryParam(e.target.value.trim());
    if (e.target.value.length === 0) {
      setOpenSearchList(false);
      setSearchedProducts(null);
    } else setOpenSearchList(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      const results = await getFilteredProducts({
        collectionName: 'products',
        attributeNames: ['name', 'description', 'search_text'],
        attributeValues: [searchKeyword],
        operator: '$containsi',
      });
      setSearchedProducts(results);
    };
    //debouncing req for 1 sec
    const getData = setTimeout(() => {
      if (searchKeyword.length > 0) {
        setSearchedProducts(null);
        fetchData();
      }
    }, 200);

    return () => clearTimeout(getData);
  }, [searchKeyword]);
  // _________________******************************_________________________*********************________________________

  //**__________________________________speech to text logic__________________________________
  const [placeholder, setPlaceholder] = useState(
    'Search Products, Requests...'
  );

  const { transcript, listening, supported, startListening, stopListening } =
    useSpeechRecognition();

  useEffect(() => {
    if (transcript.length > 0) {
      setSearchKeyword(transcript);
      setQueryParam(transcript.trim());
      setOpenSearchList(true);
      let timeoutId;

      function debounceSearch() {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(async () => {
          if (!listening) {
            const results = await getFilteredProducts({
              collectionName: 'products',
              attributeNames: ['name', 'description', 'search_text'],
              attributeValues: [searchKeyword],
              operator: '$containsi',
            });
            setSearchedProducts(results);
          }
        }, 200);
      }
      stopListening();
      debounceSearch();
    } else {
      setOpenSearchList(false);
      setSearchKeyword('');
      stopListening();
    }
    return () => stopListening();
  }, [transcript]);
  useEffect(()=>{
    if(listening) setPlaceholder('Jaldi BOL kal subah PANVEL nikalna hai...');
    else setPlaceholder('Search Products, Requests...');
  },[listening])
  return (
    <form className="flex items-center  ">
      <label htmlFor="voice-search" className="sr-only">
        Search
      </label>
      <h1 className="relative w-full">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <svg
            aria-hidden="true"
            className="h-5 w-5  text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            ></path>
          </svg>
        </div>
        <input
          type="text"
          id="voice-search"
          className="block w-full rounded-lg  bg-slate-700 p-2.5   pl-10  text-sm text-white placeholder-gray-400 "
          placeholder={placeholder}
          onKeyDown={(e) => {
            if(e.key === 'Enter') {
              e.preventDefault(); 
              handleSearchBarText(e);
              router.push(`/search?searchQuery=${queryParam}`)
            }
            handleSearchBarText(e);
          }}
          onChange={(e) => setSearchKeyword(e.target.value)}
          value={searchKeyword}
        />
        {searchKeyword.length > 0 ? (
          <button
            onClick={() => {
              setSearchKeyword('');
              setIsKeyboardOpen && setIsKeyboardOpen(false);
              setOpenSearchList(false);
              setSearchedProducts(null);
              setPlaceholder('Search Products, Requests...');
              stopListening();
            }}
            className="text-white absolute inset-y-0 right-0 flex items-center pr-3"
          >
            <Menu />
          </button>
        ) : supported ? (
          !listening ? (
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={() => {
                if (!listening) {
                  setPlaceholder('Jaldi BOL kal subah PANVEL nikalna hai...');
                  startListening();
                } else {
                  setPlaceholder('Search Products...');
                  stopListening();
                }
              }}
            >
              <svg
                aria-hidden="true"
                className="h-5 w-5  text-white md:text-gray-400 hover:text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          ) : (
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={() => {
                stopListening();
                setPlaceholder('Search Products...');
              }}
            >
              <Menu tailwindClass="text-white" />
            </button>
          )
        ) : null}
      </h1>
    </form>
  );
};

export default SearchBar;
