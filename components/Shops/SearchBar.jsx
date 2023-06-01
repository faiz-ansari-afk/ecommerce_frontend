import { useState, useEffect } from 'react';
import { deepSearchShopsOrProducts } from '@/utils/controller/searchController';
import useSpeechRecognition from '@/utils/hooks/voiceController';
// import { searchShops } from '@/utils/controller/shopController';

const SearchBar = ({
  dataSets,
  results,
  setResults,
  placeholder: plh = 'Search shops by name or area...',
  ofWhich = 'SHOPS',
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // ?? Handling voice controller__________________
  const [placeholder, setPlaceholder] = useState(plh);

  const { transcript, listening, supported, startListening, stopListening } =
    useSpeechRecognition();

  useEffect(() => {
    if (transcript.length > 0) {
      setSearchQuery(transcript);
      stopListening();
      // debounceSearch();
    } else {
      // setOpenSearchList(false);
      setSearchQuery('');
      stopListening();
    }
    return () => stopListening();
  }, [transcript]);
  return (
    <div className="flex justify-center items-center gap-5 flex-col md:flex-row">
      <div className="flex justify-end relative border rounded-lg py-2 md:py-[0.14rem]">
        <input
          className="  mx-1 rounded-md w-80 py-2 px-4 pr-8 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
          }}
        />
        {searchQuery.length === 0 ? (
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
        ) : (
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            onClick={() => {
              setSearchQuery('');
              setPlaceholder(plh);
              setResults(dataSets);
            }}
          >
            X
          </button>
        )}
      </div>
      <button
        className="bg-black rounded-full hover:shadow-lg text-white w-fit  py-2 px-4 "
        onClick={() => {
          //   updateQuery(searchQuery);
          // const result = await searchShops({searchQuery})
          const result = deepSearchShopsOrProducts({
            searchQuery,
            dataSets,
            ofWhich,
          });
          setResults(result);
        }}
        disabled={searchQuery.length === 0}
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
