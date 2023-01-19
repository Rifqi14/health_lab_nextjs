import React, { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { EmptyTable, Pagination, SideBar } from "@molecules";
import { MainLayout, Table } from "@organisms";
import { Button, Input, LengthChange, Pill, Typography } from "@atoms";
import { useRouter } from "next/router";
import assets from "public";
import axios from "axios";
import { getItemLocalStorage } from "@utils/localstorage";
import { interceptorResponseErr } from "@utils/interceptor";

const UserManagement = (props) => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [userList, setUserList] = useState([]);
  const [role, setRole] = useState([]);
  const [selectRole, setSelectRole] = useState("");
  const [dataPage, setDataPage] = useState(10);
  const [dataPerPage, setDataPerPage] = useState(dataPage);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalData, setTotalData] = useState();

  const headColumns = [
    {
      key: "no",
      name: "No",
      icon: false,
    },
    {
      key: "action",
      name: "Action",
      className: "w-3",
      icon: false,
    },
    {
      key: "nama",
      name: "Nama",
      className: "text-left",
      sortable: true,
    },
    {
      key: "email",
      name: "Email",
      sortable: true,
      className: "text-left",
    },
    {
      key: "role",
      name: "Role",
      className: "text-left",
    },
    {
      key: "status",
      name: "Status",
      icon: false,
    },
  ];

  const onClickPagination = (value) => {
    // props.pagination(value);
    setPage(value);
  };

  const onClickCreate = () => {
    router.push("/user-management/create");
  };

  const handleEdit = (id) => {
    router.push(`/user-management/edit/${id}`);
  };

  const handleViewDetail = (id) => {
    router.push(`/user-management/detail/${id}`);
  };

  const handleSelectStatus = (value) => {
    setStatus(value);
  };

  const handleSelectRole = (value) => {
    setSelectRole(value);
  };

  const URL = process.env.NEXT_PUBLIC_API_URL;
  const ls = JSON.parse(getItemLocalStorage("AUTH"));

  const getListUser = async () => {
    try {
      // axios.interceptors.response.use(
      //   res => res,
      //   error => interceptorResponseErr(error)
      // );
      const res = await axios.get(
        `${URL}/api/v1/users/datatable?RoleCode=${selectRole}&q=${search}&StatusData=${status}&p=${page}&s=${dataPage}`,
        {
          headers: {
            Authorization: `${ls.scheme} ${ls.token}`,
          },
        }
      );
      setUserList(res.data.payload.items);
      setTotalData(res.data.payload.totalItem);
    } catch (error) {
      return error;
    }
  };

  const getRole = async () => {
    try {
      // axios.interceptors.response.use(
      //   res => res,
      //   error => interceptorResponseErr(error)
      // );
      const res = await axios.get(`${URL}/api/v1/roles/select-list`, {
        headers: {
          Authorization: `${ls.scheme} ${ls.token}`,
        },
      });
      const data = res.data.payload;
      setRole(data);
    } catch (error) {
      return error;
    }
  };

  const onChangeSearch = (e) => {
    if (e.length >= 3) {
      setSearch(e.target.value);
    }
  };

  useEffect(() => {
    getListUser();
    getRole();
  }, [dataPage, search, status, selectRole, page]);

  return (
    <>
      <Head>
        <title>Bumame CMS</title>
        <link
          rel="icon"
          href={`${process.env.NEXT_PUBLIC_PREFIX_URL || ""}/favicon.ico`}
        />
      </Head>
      <MainLayout
        height={"h-auto"}
        headline={"User Management List"}
        breadcrumb={[
          {
            link: "/user-management",
            name: "List User Management",
          },
        ]}
      >
        <main className="flex flex-col bg-white rounded-lg shadow-lg p-7">
          <div className="flex justify-between pb-7">
            <Typography className={`font-medium text-lg`}>
              List User Management
            </Typography>
            <Button
              paddingVertical={`py-2`}
              paddingHorizontal={`px-4`}
              background={`bg-btnBlue`}
              className="flex items-center justify-center"
              onClick={() => onClickCreate()}
            >
              <Image src={assets.IconPlus} alt="create" />
              <Typography className={`text-white font-normal text-sm pl-2`}>
                Create
              </Typography>
            </Button>
          </div>
          <div className="flex justify-between pb-4">
            <div className="flex">
              <select
                className="p-2 w-60 focus:outline-none bg-transparent rounded border active:outline-none"
                name="product"
                id=""
                value={selectRole}
                onChange={(e) => handleSelectRole(e.target.value)}
              >
                <option value="">Select Role</option>
                {role.length > 0
                  ? role.map((item, key) => {
                      return (
                        <option
                          className="text-black"
                          key={key}
                          value={item.roleCode}
                        >
                          {item.roleName}
                        </option>
                      );
                    })
                  : null}
              </select>
              <select
                className="p-2 ml-4 w-60 focus:outline-none rounded bg-white border active:outline-none"
                name="product"
                id=""
                value={status}
                onChange={(e) => handleSelectStatus(e.target.value)}
              >
                <option value="">Select Status</option>
                <option value="Active">Active</option>
                <option value="InActive">Inactive</option>
              </select>
            </div>
            <div className="">
              <div className="border rounded-lg flex items-center px-2">
                <Image src={assets.IconSearch} alt="search" />
                <input
                  onChange={(e) => setSearch(e.target.value)}
                  value={search}
                  placeholder="Search"
                  className="bg-white py-2 w-64 pl-2  focus:outline-none"
                  type="search"
                />
              </div>
            </div>
          </div>
          <div className="w-full h-full overflow-x-auto space-y-[16px] flex flex-col rounded border border-[#E6E6E6]">
            <Table headColumns={headColumns}>
              {userList.length > 0 ? (
                userList.map((item, key) => {
                  return (
                    <tr
                      key={key}
                      className={`text-center ${
                        key % 2 != 0 ? "bg-gray" : "bg-white"
                      }`}
                    >
                      <td className={`px-[8px] py-[5px] `}>
                        <Typography className={`font-normal text-sm`}>
                          {dataPerPage < 10
                            ? page
                            : page - 1 > 0
                            ? dataPerPage * (page - 1) + ++key
                            : ++key}
                        </Typography>
                      </td>
                      <td className={`px-[8px] py-[5px] flex justify-center`}>
                        <Button
                          background={`bg-label-completed-text`}
                          className={`rounded-md w-8 h-8 flex items-center bg-label-completed-text-1 mx-1 shadow`}
                          paddingHorizontal={""}
                          paddingVertical={""}
                          onClick={() => {
                            handleViewDetail(item.userId);
                          }}
                        >
                          <Image
                            width={18}
                            height={18}
                            src={assets.IconEyeOpenWhite}
                            alt={"Icon detail"}
                          />
                        </Button>
                        <Button
                          background={`bg-btnBlue`}
                          className={`rounded-md w-8 h-8 flex items-center bg-btnBlue mx-1 shadow`}
                          paddingHorizontal={""}
                          paddingVertical={""}
                          onClick={() => handleEdit(item.userId)}
                        >
                          <Image
                            width={18}
                            height={18}
                            src={assets.IconEditWhite}
                            alt={"Icon detail"}
                          />
                        </Button>
                      </td>
                      <td className={`pr-16 py-[5px] text-left pl-2`}>
                        <Typography className={`font-normal text-sm`}>
                          {item.name}
                        </Typography>
                      </td>
                      <td className={`pl-2 pr-8 py-[5px] text-left`}>
                        <Typography className={`font-normal text-sm`}>
                          {item.email}
                        </Typography>
                      </td>
                      <td className={`py-[5px] pl-2 text-left`}>
                        <Typography className={`font-normal text-sm`}>
                          {item.roleName}
                        </Typography>
                      </td>
                      <td className={`px-[8px] py-[5px] flex justify-center`}>
                        <Pill type={item.statusData} />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <EmptyTable
                  colSpan={7}
                  title={`List User Management Code empty`}
                />
              )}
            </Table>
            <div className={`py-4 pl-3 flex`}>
              <div className={`flex flex-row items-center`}>
                <Typography>Showing</Typography>
                <select
                  value={dataPage}
                  onChange={(e) => setDataPage(e.target.value)}
                  className="bg-white mx-2 border border-[#E6E6E6] rounded-md p-1 focus:outline-none"
                  name=""
                  id=""
                >
                  <option value="10">10</option>
                  <option value="15">15</option>
                  <option value="20">20</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </select>
                <Typography>Entries</Typography>
              </div>
              <Pagination
                itemsPerPage={dataPerPage || 10}
                total={totalData || 0}
                onClick={(value) => onClickPagination(value)}
                currentPage={page || 1}
              />
            </div>
          </div>
        </main>
      </MainLayout>
    </>
  );
};

export default UserManagement;
