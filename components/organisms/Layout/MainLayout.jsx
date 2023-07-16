import React from 'react';
import { Header } from 'components/organisms';
import { BreadCrumb, SideBar } from 'components/molecules';

const MainLayout = props => {
  const { children, headline, breadcrumb, height, pBottom, className } = props;

  return (
    <>
      <main className={`flex flex-col w-full text-black ${height}`}>
        <div className={`bg-[#F2F3F8] w-full h-full ${pBottom} flex`}>
          <SideBar />
          <div className={`w-full`}>
            <Header className={`hidden md:flex`} />
            <BreadCrumb headline={headline} breadcrumb={breadcrumb} />
            <div className={`p-7 w-full`}>{children}</div>
          </div>
        </div>
      </main>
    </>
  );
};

export default MainLayout;
