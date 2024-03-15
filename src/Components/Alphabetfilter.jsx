import React, { useState } from 'react';

const Alphabetfilter = ({
  selectedFilter,
  onFilterChange,
  alphabetFilerSelected,
}) => {
  const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const [selectedAlphabet, setSelectedAlphabet] = useState('');

  const handleClick = (alphabet) => {
    alphabetFilerSelected();
    setSelectedAlphabet(alphabet === selectedAlphabet ? '' : alphabet);
    alphabet
      ? onFilterChange('name_like', `^${alphabet}`)
      : onFilterChange('name_like', '');
  };

  return (
    <div className='lb-sort-stores me-auto'>
      <ul>
        <li
          className={`pointer ${
            !selectedFilter.name_like?.startsWith('^') ? 'active' : ''
          }`}
          onClick={() => handleClick('')}
        >
          All
        </li>
        {alphabets.map((alphabet) => (
          <li
            key={alphabet}
            className={`pointer ${
              selectedAlphabet === alphabet &&
              selectedFilter.name_like?.startsWith('^')
                ? 'active'
                : ''
            }`}
            onClick={() => handleClick(alphabet)}
          >
            {alphabet}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Alphabetfilter;
