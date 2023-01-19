import React, { useEffect, useState } from "react";
import { MainLayout } from "@organisms";
import {
  Button,
  Pill,
  Typography,
  UserDetail,
  Card,
  Label,
  Modal,
} from "@atoms";
import Head from "next/head";
import Image from "next/image";
import assets from "@/public/index";
import axios from "axios";
import { getItemLocalStorage } from "@utils/localstorage";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { deleteCorporate } from "components/store/actions/corporate";
import ModalConfirmation from "../../../../components/Modals/ModalConfirmation";

const Detail = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [DataPics, setDataPics] = useState([]);
  const [sites, setSites] = useState([]);
  const [showModals, setShowModals] = useState(false);
  const [dataDocuments, setDataDocuments] = useState([]);
  const [data, setData] = useState([]);
  const [onDeleteData, setOnDeleteData] = useState(false);
  const [showSuccessDeleteModal, setShowSuccessDeleteModal] = useState(false);
  const code = router.query.id;

  const typeSurat = [
    {
      id: 1,
      type1: "SPH",
    },
    {
      id: 2,
      type2: "SPK",
    },
    {
      id: 3,
      type3: "Data",
    },
    {
      id: 4,
      type4: "Surat_Vendro",
    },
    {
      id: 5,
      type5: "NPWP",
    },
  ];

  const URL = process.env.NEXT_PUBLIC_API_URL;
  const ls = JSON.parse(getItemLocalStorage("AUTH"));

  const getDetailData = async () => {
    try {
      axios.interceptors.response.use(
        (res) => res,
        (error) => interceptorResponseErr(error)
      );
      const res = await axios.get(`${URL}/api/v1/corporates/${code}`, {
        headers: {
          Authorization: `${ls.scheme} ${ls.token}`,
        },
      });
      setData(res.data.payload);
      if (
        res.data.payload.pics.length === 0 ||
        res.data.payload.pics[0] === null
      ) {
        setDataPics([
          {
            index: 0,
            name: "-",
            title: "Corporate",
            contact: "-",
            email: "-",
          },
          {
            index: 1,
            name: "-",
            title: "Operasional",
            contact: "-",
            email: "-",
          },
          {
            index: 2,
            name: "-",
            title: "Finance",
            contact: "-",
            email: "-",
          },
        ]);
      } else {
        setDataPics(res.data.payload.pics);
      }
      setDataDocuments(res.data.payload.documents);
      setSites(res.data.payload.sites);
    } catch (error) {
      return error;
    }
  };

  var docSpk = dataDocuments.filter((item) => {
    return item.type.toLowerCase() == "spk";
  });

  var docSph = dataDocuments.filter((item) => {
    return item.type.toLowerCase() == "sph";
  });

  var NPWP = dataDocuments.filter((item) => {
    return item.type.toLowerCase() == "npwp";
  });

  var identity = dataDocuments.filter((item) => {
    return item.type.toLowerCase() == "identity";
  });

  var docVendor = dataDocuments.filter((item) => {
    return item.type.toLowerCase() == "vendor_document";
  });

  useEffect(() => {
    getDetailData();
  }, [code]);

  const handleDelete = (code) => {
    setOnDeleteData(true);
    dispatch(deleteCorporate(code)).then((res) => {
      setShowModals(false);
      setShowSuccessDeleteModal(true);
      setOnDeleteData(false);
    });
  };

  const handleback = () => {
    router.back();
  };

  return (
    <>
      <Head>
        <title>CMS Bumame</title>
      </Head>
      <MainLayout>
        <Card>
          <div className="mb-[15px] flex justify-between">
            <Typography className={`font-medium text-lg text-[#212121]`}>
              Corporate Identity
            </Typography>
            <Button
              paddingVertical={`py-2`}
              paddingHorizontal={`px-4`}
              background={`bg-inActive`}
              className={"flex items-center justify-center"}
              onClick={() => setShowModals(true)}
            >
              <Image src={assets.IconTrash} alt="create" />
              <Typography className={`text-white font-normal text-sm pl-2`}>
                Delete
              </Typography>
            </Button>
          </div>
          <div className={`grid gap-16 mb-6 md:grid-cols-3`}>
            <div>
              <Label>Nama Corporate</Label>
              <UserDetail label={`${data.name}`} className={"!w-auto"} />
            </div>
            <div>
              <Label>Total User</Label>
              <UserDetail title={`${data.totalUser}`} className={"!w-auto"} />
            </div>
          </div>
          <div className={`grid gap-16 mb-6 md:grid-cols-3`}>
            <div>
              <Label>Brand Corporate</Label>
              <UserDetail title={`${data.brand}`} className={"!w-auto"} />
            </div>
            <div>
              <Label>Phone</Label>
              <UserDetail title={`${data.phoneNumber}`} className={"!w-auto"} />
            </div>
          </div>
          <div className={`grid gap-16 mb-6 md:grid-cols-3`}>
            <div>
              <Label>Code Corporate</Label>
              <UserDetail title={`${data.code}`} className={"!w-auto"} />
            </div>
            <div>
              <Label>Tax ID</Label>
              <UserDetail title={`${data.taxId}`} className={"!w-auto"} />
            </div>
          </div>
          <div className={`grid gap-16 mb-6 md:grid-cols-3`}>
            <div>
              <Label>Categorie</Label>
              <UserDetail title={`${data.catagories}`} className={"!w-auto"} />
            </div>
            <div>
              <Label>AR Due Date</Label>
              <UserDetail title={`${data.arDueDate}`} className={"!w-auto"} />
            </div>
          </div>
          <Typography className={`font-medium text-lg text-[#212121]`}>
            Address
          </Typography>
          <div className={`grid gap-16 mb-6 md:grid-cols-3`}>
            <div>
              <Label>Address</Label>
              <UserDetail title={`${data.address}`} className={"!w-auto"} />
            </div>
            <div>
              <Label>Subdistrict</Label>
              <UserDetail title={`${data.subDistinct}`} className={"!w-auto"} />
            </div>
          </div>
          <div className={`grid gap-16 mb-6 md:grid-cols-3`}>
            <div>
              <Label>Province</Label>
              <UserDetail title={`${data.province}`} className={"!w-auto"} />
            </div>
            <div>
              <Label>RT</Label>
              <UserDetail title={`${data.rt}`} className={"!w-auto"} />
            </div>
          </div>
          <div className={`grid gap-16 mb-6 md:grid-cols-3`}>
            <div>
              <Label>City</Label>
              <UserDetail title={`${data.city}`} className={"!w-auto"} />
            </div>
            <div>
              <Label>RW</Label>
              <UserDetail title={`${data.rw}`} className={"!w-auto"} />
            </div>
          </div>
          <div className={`grid gap-16 mb-6 md:grid-cols-3`}>
            <div>
              <Label>District</Label>
              <UserDetail title={`${data.district}`} className={"!w-auto"} />
            </div>
          </div>
          <Typography className={`font-medium text-lg text-[#212121]`}>
            PIC
          </Typography>
          {DataPics.length > 0
            ? DataPics.map((item, key) => {
                return (
                  <>
                    {item ? (
                      <>
                        <div
                          className="grid gap-16 mb-6 md:grid-cols-3"
                          key={key}
                        >
                          <div>
                            <Label>PIC Name </Label>
                            <UserDetail
                              title={`${item.name}`}
                              className={"!w-auto"}
                            />
                          </div>
                          <div>
                            <Label>Contact PIC </Label>
                            <UserDetail
                              title={`${item.contact}`}
                              className={"!w-auto"}
                            />
                          </div>
                          <div></div>
                        </div>
                        <div
                          className="grid gap-16 mb-6 md:grid-cols-3"
                          key={key}
                        >
                          <div>
                            <Label>Title PIC</Label>
                            <UserDetail
                              title={`${item.title}`}
                              className={"!w-auto"}
                            />
                          </div>
                          <div>
                            <Label>Email PIC</Label>
                            <UserDetail
                              title={`${item.email}`}
                              className={"!w-auto"}
                            />
                          </div>
                        </div>
                      </>
                    ) : null}

                    {key !== 2 ? (
                      <div className="grid mb-6 md:grid-cols-3">
                        <div className="w-100 bg-disabled-btn h-[3px] grid md:grid-cols-2"></div>
                        <div className="w-100 bg-disabled-btn h-[3px] grid md:grid-cols-2"></div>
                      </div>
                    ) : null}
                  </>
                );
              })
            : null}
          <div className={`grid gap-16 mb-6 md:grid-cols-3`}>
            <div>
              <Label>Assign Site</Label>
              {sites.length > 0 &&
                sites.map((item, key) => {
                  return (
                    <UserDetail
                      key={key}
                      title={`${item.siteName}`}
                      className={"!w-auto"}
                    />
                  );
                })}
            </div>
          </div>
          <Typography className={`font-medium text-lg text-[#212121]`}>
            Supporting Data
          </Typography>
          {/* {dataDocuments.length > 0
            ? dataDocuments.map((item, key) => {
                return ( */}
          <>
            <div className={`grid gap-16 mb-6 md:grid-cols-2`}>
              <div>
                <Label>
                  <Typography>SPK</Typography>
                </Label>

                <div className="border-[1px] border-[#E6E6E6] rounded-[5px]">
                  <table className="w-full ">
                    <thead className="bg-[#F3F6F9] text-sm font-semibold text-[#575962] h-[50px] ">
                      <th className="text-start py-[15px] px-[19px]">No</th>
                      <th className="text-start py-[15px] px-[19px]">File</th>
                      <th className="text-start py-[15px] px-[19px]">Note</th>
                    </thead>
                    <tbody>
                      {docSpk &&
                        docSpk.map((item, key) => {
                          return (
                            <tr
                              key={key}
                              className="text-sm text-[#575962] h-[50px]"
                            >
                              <td className="text-start py-[15px] px-[19px]">
                                {key + 1}
                              </td>
                              <td className="text-start py-[15px] px-[19px]">
                                {item.filename}
                              </td>
                              <td className="text-start py-[15px] px-[19px]">
                                {item.notes}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <Label>
                  <Typography>Surat Penawaran Harga</Typography>
                </Label>
                <div className="border-[1px] border-[#E6E6E6] rounded-[5px]">
                  <table className="w-full ">
                    <thead className="bg-[#F3F6F9] text-sm font-semibold text-[#575962] h-[50px] ">
                      <th className="text-start py-[15px] px-[19px]">No</th>
                      <th className="text-start py-[15px] px-[19px]">File</th>
                      <th className="text-start py-[15px] px-[19px]">Note</th>
                    </thead>
                    {docSph.length > 0
                      ? docSph.map((item, index) => {
                          return (
                            <>
                              <tbody key={index}>
                                <tr className="text-sm text-[#575962] h-[50px]">
                                  <td className="px-[19px]">{index + 1}</td>
                                  <td className="text-start py-[15px] px-[19px]">
                                    {item.filename}
                                  </td>
                                  <td className="text-start py-[15px] px-[19px]">
                                    {item.notes}
                                  </td>
                                </tr>
                              </tbody>
                            </>
                          );
                        })
                      : null}
                  </table>
                </div>
              </div>
            </div>
            <div className={`grid gap-16 mb-6 md:grid-cols-2`}>
              <div>
                <Label>
                  <Typography>NPWP</Typography>
                </Label>
                <div className="border-[1px] border-[#E6E6E6] rounded-[5px]">
                  <table className="w-full ">
                    <thead className="bg-[#F3F6F9] text-sm font-semibold text-[#575962] h-[50px] ">
                      <th className="text-start py-[15px] px-[19px]">No</th>
                      <th className="text-start py-[15px] px-[19px]">File</th>
                      <th className="text-start py-[15px] px-[19px]">Note</th>
                    </thead>
                    <tbody>
                      {NPWP.length > 0
                        ? NPWP.map((item, i) => {
                            return (
                              <>
                                <tr className="text-sm text-[#575962] h-[50px]">
                                  <td className="px-[19px]">{i + 1}</td>
                                  <td className="text-start py-[15px] px-[19px]">
                                    {item.filename}
                                  </td>
                                  <td className="text-start py-[15px] px-[19px]">
                                    {item.notes}
                                  </td>
                                </tr>
                              </>
                            );
                          })
                        : null}
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <Label>
                  <Typography>
                    Data ID(KTP/Passport) Karyawan yang di swab
                  </Typography>
                </Label>
                <div className="border-[1px] border-[#E6E6E6] rounded-[5px]">
                  <table className="w-full ">
                    <thead className="bg-[#F3F6F9] text-sm font-semibold text-[#575962] h-[50px] ">
                      <th className="text-start py-[15px] px-[19px]">No</th>
                      <th className="text-start py-[15px] px-[19px]">File</th>
                      <th className="text-start py-[15px] px-[19px]">Note</th>
                    </thead>
                    <tbody>
                      {identity.length > 0
                        ? identity.map((item, index) => {
                            return (
                              <>
                                <tr className="text-sm text-[#575962] h-[50px]">
                                  <td className="px-[19px]">{index + 1}</td>
                                  <td className="text-start py-[15px] px-[19px]">
                                    {item.filename}
                                  </td>
                                  <td className="text-start py-[15px] px-[19px]">
                                    {item.notes}
                                  </td>
                                </tr>
                              </>
                            );
                          })
                        : null}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className={`grid gap-16 mb-6 md:grid-cols-2`}>
              <div>
                <Label>
                  <Typography>Surat Vendor</Typography>
                </Label>
                <div className="border-[1px] border-[#E6E6E6] rounded-[5px]">
                  <table className="w-full ">
                    <thead className="bg-[#F3F6F9] text-sm font-semibold text-[#575962] h-[50px] ">
                      <th className="text-start py-[15px] px-[19px]">No</th>
                      <th className="text-start py-[15px] px-[19px]">File</th>
                      <th className="text-start py-[15px] px-[19px]">Note</th>
                    </thead>
                    <tbody>
                      {docVendor.length > 0
                        ? docVendor.map((item, index) => {
                            return (
                              <>
                                <tr className="text-sm text-[#575962] h-[50px]">
                                  <td className="px-[19px]">{index + 1}</td>
                                  <td className="text-start py-[15px] px-[19px]">
                                    {item.filename}
                                  </td>
                                  <td className="text-start py-[15px] px-[19px]">
                                    {item.notes}
                                  </td>
                                </tr>
                              </>
                            );
                          })
                        : null}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
          {/* );
              })
            : null} */}
          <div className="flex justify-center mt-6">
            <Button
              paddingVertical={`py-2`}
              paddingHorizontal={`px-7`}
              background={`bg-btn-cancel`}
              className={`ml-2`}
              onClick={() => handleback()}
            >
              <Typography className={` font-normal text-sm`}>Back</Typography>
            </Button>
          </div>
        </Card>
        {/* Confirmation Delete Data */}
        <ModalConfirmation
          show={showModals}
          // confirmation={`Confirmation`}
          confirmDelete={true}
          onHide={() => setShowModals(false)}
          handleYes={() => {
            handleDelete(code);
          }}
          desc1="Apakah anda yakin akan menghapus data ini?"
          isLoading={onDeleteData}
        />
        <Modal
          setIsOpen={(val) => setShowSuccessDeleteModal(val)}
          width={`w-[27rem]`}
          title={`Success`}
          headless
          isOpen={showSuccessDeleteModal}
        >
          <div>
            <Image
              src={assets.ImageCheckedGreen}
              alt={`Success dialog image`}
            />
          </div>
          <Typography className={`pt-8`}>Data berhasil dihapus</Typography>
          <div className="flex justify-center pt-8">
            <Button
              onClick={() => router.push("/master-corporate")}
              color={`white`}
              background={`bg-btnBlue`}
            >
              <Typography className={`text-white font-normal text-sm`}>
                OK
              </Typography>
            </Button>
          </div>
        </Modal>
      </MainLayout>
    </>
  );
};

export default Detail;
