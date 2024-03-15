import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import InfiniteScroll from 'react-infinite-scroll-component';

import Checkbox from './Checkbox';
import Alphabetfilter from './Alphabetfilter';
const AllStores = ({
  className,
  selectedFilters,
  onFilterChange,
  categoryName,
}) => {
  const [stores, setStores] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [likedStores, setLikedStores] = useState([]);

  const [cashbackValue, setCashbackChecked] = useState(
    selectedFilters.cashback_enabled
  );
  const [promotedValue, setPromotedChecked] = useState(
    selectedFilters.is_promoted
  );
  const [shareValue, setShareChecked] = useState(selectedFilters.is_shareable);
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/stores', {
        params: { ...selectedFilters, _page: page, _limit: 20 },
      });
      setStores(response.data);
      if (response.data.length === 0) {
        setHasMore(false);
      } else {
        setStores((prevStores) => [...prevStores, ...response.data]);
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error('Error fetching stores:', error);
    }
  };

  useEffect(() => {
    console.log('call it when change');
    fetchData();
    const liked = JSON.parse(localStorage.getItem('likedStores') || '[]');
    console.log('liked', liked);
    setLikedStores(liked);
  }, [selectedFilters]);

  function alphabetFilerSelected() {
    setSearch('');
    onFilterChange('name_like', search);

    console.log('search filter called');
  }

  function handleSearch() {
    onFilterChange('name_like', search);
  }

  const handleSortChange = (key, value) => {
    onFilterChange(key, value);
  };

  const handleScroll = () => {
    if (!hasMore) return;
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      fetchData();
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasMore]);

  const handleLikeToggle = (key, storeId) => {
    console.log(key, storeId);

    let newLikedStores;
    if (key === 'add') {
      newLikedStores = [...likedStores, storeId];

      setLikedStores(newLikedStores);
    } else if (key === 'remove') {
      newLikedStores = likedStores.filter((id) => id !== storeId);
      setLikedStores(newLikedStores);
    }
    console.log(newLikedStores);

    localStorage.setItem('likedStores', JSON.stringify(newLikedStores));
  };

  const isStoreLiked = (storeId) => likedStores.includes(storeId);

  const getCashbackDisplay = (store) => {
    if (store.cashback_enabled === 0) {
      return 'No cashback available';
    }

    let cashbackString = '';
    cashbackString += store.rate_type === 'upto' ? 'Upto ' : 'Flat ';
    cashbackString += store.amount_type === 'fixed' ? '$' : '';
    cashbackString += store.cashback_amount.toFixed(2);
    cashbackString += store.amount_type === 'percent' ? '%' : '';
    cashbackString += ' Cashback';

    return cashbackString;
  };

  return (
    <div className={`my-[50px] ${className}`}>
      <div>Category : {categoryName}</div>

      <div className='filterBox'>
        <div>
          <select
            className='form-select'
            value={status}
            onChange={(e) => {
              onFilterChange('status', e.target.value);
              setStatus(e.target.value);
            }}
          >
            <option value=''>Select Status</option>

            <option value='publish'>Publish</option>
            <option value='draft'>Draft</option>
            <option value='trash'>Trash</option>
          </select>
        </div>

        {/* Search box */}

        <div>
          <input
            class='form-control'
            name='searchStores'
            id='searchStores'
            placeholder='Search stores'
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              handleSearch();
            }}
          />
        </div>

        {/* sorting */}
        <select
          className='form-select'
          value={selectedFilters._sort}
          onChange={(e) => handleSortChange('_sort', e.target.value)}
        >
          <option value=''>Sort by</option>
          <option value='name'>Name</option>
          <option value='is_featured'>Featured</option>
          <option value='clicks'>Popularity</option>
          <option value='cashback_amount'>Cashback</option>
        </select>
        <select
          className='form-select'
          value={selectedFilters._order}
          onChange={(e) => handleSortChange('_order', e.target.value)}
        >
          <option value='asc'>Ascending</option>
          <option value='desc'>Descending</option>
        </select>
      </div>

      {/* checkbox div */}
      <div className='checkbox-parent'>
        {/* Check boxes */}
        <Checkbox
          label='Cashback Enabled'
          value={cashbackValue}
          onChange={() => {
            setCashbackChecked(!cashbackValue);
            onFilterChange(
              'cashback_enabled',
              selectedFilters.cashback_enabled === 0 ? 1 : 0
            );
          }}
        />
        <Checkbox
          label='Promoted'
          value={promotedValue}
          onChange={() => {
            setPromotedChecked(!promotedValue);
            onFilterChange(
              'is_promoted',
              selectedFilters.is_promoted === 0 ? 1 : 0
            );
          }}
        />
        <Checkbox
          label='Share and Earn'
          value={shareValue}
          onChange={() => {
            setShareChecked(!shareValue);
            onFilterChange(
              'is_shareable',
              selectedFilters.is_shareable === 0 ? 1 : 0
            );
          }}
        />
      </div>

      {/* alphabet filter */}

      <Alphabetfilter
        alphabetFilerSelected={alphabetFilerSelected}
        selectedFilter={selectedFilters}
        onFilterChange={onFilterChange}
      />

      {/* <InfiniteScroll
        dataLength={stores.length}
        next={fetchData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        scrollThreshold='100px'
      > */}
      <div className='store-parent'>
        {stores.map((store, index) => {
          return (
            <div
              onClick={() => {
                window.location.href = store.homepage;
              }}
              className='shadow-xl bg-white m-4 single-store'
              key={index}
            >
              <div className='icon-parent'>
                {isStoreLiked(store.id) ? (
                  <HeartIconSolid
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLikeToggle('remove', store.id);
                    }}
                    className='h-6 w-6 text-red-500'
                  />
                ) : (
                  <HeartIcon
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLikeToggle('add', store.id);
                    }}
                    className='h-6 w-6 text-gray-500'
                  />
                )}
              </div>

              <div>
                <img src={store.logo} alt='logo' />
                <h3 className='text-center'>{store.name}</h3>
                <p>{store.description}</p>
              </div>

              <span className='cashback'>{getCashbackDisplay(store)}</span>
              {/* <button>Shop Now</button> */}

              {/* Add more store details as needed */}
            </div>
          );
        })}
      </div>
      {/* </InfiniteScroll> */}
    </div>
  );
};

export default AllStores;
