import {  useEffect, useState } from 'react';
import Select from 'react-select';
import slugify from 'slugify';
import { useRouter } from 'next/router';
import useSpeechRecognition from '@/utils/hooks/voiceController';
import { Menu } from '../Icon';

const SearchBar = ({
  fetchResultFromBackend,
  category,
  setCategory,
  categories,
  searchQuery,
  setSearchQuery,
  setSortBy,
  updateQuery,
}) => {
  const router = useRouter();

  //__________________________________________Category drop down logic _______________________________________________
  const categoryListRaw = categories.map((category) => {
    return {
      value: slugify(category),
      label: category,
    };
  });
  const categoryList = [
    { value: slugify('All Categories'), label: 'All Categories' },
    ...categoryListRaw,
  ];

  const [defaultCategory, setDefaultCategory] = useState(() => {
    if (router.query?.category) {
      const match = categoryList.findIndex(
        (option) => option.value === router.query.category
      );
      if (match >= 0) {
        return categoryList[match];
      } else {
        // //console.log('else of default category effect');
        return categoryList[0];
      }
    } else {
      return categoryList[0];
    }
  });
  //useEffect for selecting deafult category
  useEffect(() => {
    if (router.query?.category) {
      const match = categoryList.findIndex(
        (option) => option.value === router.query.category
      );
      if (match >= 0) {
        setDefaultCategory(categoryList[match]);
      } else {
        setDefaultCategory(categoryList[0]);
      }
    }
  }, [router.query?.category]);
  // _____________________________________________________________________________________________________
  //? protecting search button to avoiid sending req again and again
  const [debounced, setDebounced] = useState(false);
  const handleSearch = () => {
    if (!debounced) {
      setDebounced(true);
      setTimeout(() => {
        setDebounced(false);
      }, 500); // set the time you want to wait before allowing another click
      // call your search function here
      if (searchQuery !== '') {
        setSortBy(null);
        // updateQuery(searchQuery, slugify(category));
        const searchValuesArray = searchQuery.split(' ');
        fetchResultFromBackend(searchValuesArray, 1);
      } else {
        alert('please enter something to search');
      }
    } else {
      alert('please wait while we search');
    }
  };
  // ?? Handling voice controller__________________
  const [placeholder, setPlaceholder] = useState('Search Products...');

  const { transcript, listening, supported, startListening, stopListening } =
    useSpeechRecognition();

  useEffect(() => {
    if (transcript.length > 0) {
      setSearchQuery(transcript);
      let timeoutId;

      function debounceSearch() {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
          if (!listening) {
          }
        }, 1000);
      }
      stopListening();
      debounceSearch();
    } else {
      // setOpenSearchList(false);
      setSearchQuery('');
      stopListening();
    }
    return () => stopListening();
  }, [transcript]);
  return (
    <div className="flex  items-center justify-center my-6 flex-col gap-4 md:flex-row">
      <div className="w-[12rem] hidden md:block">
        <Select
          instanceId={'lol'}
          onChange={(option) => {
            setCategory(option.label);
            updateQuery(searchQuery, slugify(option.label));
          }}
          options={categoryList}
          defaultValue={defaultCategory}
        />
      </div>

      <div className="flex justify-end  relative border rounded-lg py-2 md:py-[0.14rem]">
        <input
          className="  mx-1 rounded-md w-80 py-2 px-4  leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
          }}
          onKeyDown={(e)=>{ if(e.key === 'Enter'){e.preventDefault(); handleSearch();}}}
        />
        {searchQuery.length > 0 ? (
          <button
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            onClick={() => {
              setSearchQuery('');
              setPlaceholder('Search Products...');
              stopListening();
            }}
          >
            <Menu />
          </button>
        ) : (
          supported ? !listening ? 
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={() => {
                if (!listening) {
                  setPlaceholder('Jaldi BOL kal subah PANVEL nikalna hai...');
                  startListening();
                }
              }}
            >
              <svg
                aria-hidden="true"
                className="h-5 w-5   text-black"
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
          : <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center pr-3"
          onClick={() => {
            stopListening();
            setPlaceholder('Search Products...');
          }}
        >
          <Menu tailwindClass="text-black" />
        </button> : null
        )}
      </div>
      {/* <ul id="suggestions"></ul> */}

      <div className="flex gap-3">
        <div className="w-[13rem] md:hidden">
          <Select
            instanceId={'lol1'}
            onChange={(option) => {
              setCategory(option.label);
              // updateQuery(searchQuery, slugify(option.label));
            }}
            options={categoryList}
            defaultValue={defaultCategory}
          />
        </div>
        <button
          className="bg-black rounded-full hover:shadow-lg text-white  py-2 px-4 "
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
