import React from 'react';
const { useState, useEffect } = require('react');

const Categories = ({
  className,
  categories,
  onFilterChange,
  onCategoryChange,
}) => {
  return (
    <div className={`${className} my-[50px] category-main`}>
      <div className='cateogry-heading'>
        <p> Store Categories</p>
      </div>

      <div className='category-child '>
        {categories.map((cat, index) => {
          return (
            <p
              className='cursor-pointer	'
              id={cat.id}
              key={index} // because there is data with same id
              onClick={() => {
                onFilterChange('cats', cat.id);
                onCategoryChange(cat.name);
              }}
            >
              {cat.name}
            </p>
          );
        })}
      </div>
    </div>
  );
};

export default Categories;
