import React, { useState } from 'react';

const Alphabetfilter = ({
  selectedFilter,
  onFilterChange,
  alphabetFilerSelected,
}) => {
  const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const [selectedAlphabet, setSelectedAlphabet] = useState(
    selectedFilter.name_like?.startsWith('^') ? selectedFilter.name_like : ''
  );

  const handleClick = (alphabet) => {
    alphabetFilerSelected();
    const newAlphabet =
      selectedAlphabet === alphabet ? '' : alphabet === '' ? '' : alphabet;
    setSelectedAlphabet(newAlphabet);
    onFilterChange('name_like', newAlphabet ? `^${newAlphabet}` : '');
  };

  console.log(
    'start ',
    !selectedAlphabet || !selectedFilter.name_like?.startsWith('^'),
    selectedFilter
  );

  return (
    <div className='lb-sort-stores me-auto'>
      <ul>
        <li
          className={`pointer ${
            !selectedAlphabet || !selectedFilter.name_like?.startsWith('^')
              ? 'active'
              : ''
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
