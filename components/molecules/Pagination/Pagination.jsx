import Image from 'next/image';
import assets from 'public';
import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';

const Pagination = props => {
  const { itemsPerPage, total, onClick, currentPage } = props;
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    setPageCount(Math.ceil(total / itemsPerPage));
  }, [itemsPerPage, total]);

  const handlePageClick = index => {
    onClick(index + 1);
  };

  return (
    <>
      <ReactPaginate
        breakLabel={`...`}
        nextLabel={
          <Image width={16} alt={`Next Logo`} src={assets.IconArrowRight} />
        }
        forcePage={currentPage - 1 || 0}
        onPageChange={e => handlePageClick(e.selected)}
        pageCount={pageCount}
        marginPagesDisplayed={1}
        previousLabel={
          <Image width={16} alt={`Previous Logo`} src={assets.IconArrowLeft} />
        }
        renderOnZeroPageCount={null}
        previousClassName={`bg-white w-[2rem] h-[2rem] flex justify-center items-center border border-[1px] rounded-[5px] shadow`}
        nextClassName={`bg-white w-[2rem] h-[2rem] flex justify-center items-center border border-[1px] rounded-[5px] shadow`}
        containerClassName='w-full gap-2 pr-4 flex justify-end items-center'
        pageClassName='p-[8px] text-[16px] min-w-[32px] h-[32px] flex items-center justify-center'
        activeClassName='bg-white p-[8px] border border-[1px] rounded-[5px] text-[16px] w-[2rem] h-[2rem] flex items-center justify-center shadow'
      />
    </>
  );
};

export default Pagination;
