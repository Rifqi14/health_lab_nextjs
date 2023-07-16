import assets from 'public/index';
import { Typography } from 'components/atoms';
import { SORTING_ORDER } from 'components/constants/SortingOrder';
import Image from 'next/image';
import React from 'react';

const TableHeader = props => {
  const {
    headColumns,
    onClick = () => {},
    sortDirection = '',
    sortColumn
  } = props;

  return (
    <>
      <thead className={`bg-[#F3F6F9]`}>
        <tr>
          {headColumns &&
            headColumns.map((column, key) => {
              return (
                <th
                  key={key}
                  className={`py-[15px] px-[8px] ${
                    column.className && column.className
                  }`}
                  onClick={e => column.sortable && onClick(e, column)}
                >
                  <div
                    className={`flex flex-row ${
                      !column.className?.includes('text-left') &&
                      'justify-center'
                    } items-center`}
                  >
                    <Typography
                      className={`font-semibold text-sm ${
                        column.sortable && ''
                      }`}
                    >
                      {column.name}
                    </Typography>
                    {(column.key != sortColumn || sortDirection === '') &&
                      column.sortable && (
                        <div className={`relative`}>
                          <Image
                            src={assets.IconSortDefault}
                            alt={`sort empty`}
                          />
                        </div>
                      )}
                    {column.key === sortColumn &&
                      sortDirection === SORTING_ORDER[1] && (
                        <div className={`top-0.5 relative`}>
                          <Image
                            src={assets.IconSortSelected}
                            alt={`sort asc`}
                          />
                        </div>
                      )}
                    {column.key === sortColumn &&
                      sortDirection === SORTING_ORDER[2] && (
                        <div className={`rotate-180`}>
                          <Image
                            src={assets.IconSortSelected}
                            alt={`sort desc`}
                          />
                        </div>
                      )}
                  </div>
                </th>
              );
            })}
        </tr>
      </thead>
    </>
  );
};

const Table = props => {
  const { headColumns, children, sortableHeader, sortDirection, sortColumn } =
    props;

  return (
    <>
      <table className='w-full border'>
        <TableHeader
          headColumns={headColumns}
          onClick={sortableHeader}
          sortDirection={sortDirection}
          sortColumn={sortColumn}
        />
        <tbody>{children}</tbody>
      </table>
    </>
  );
};

export default Table;
