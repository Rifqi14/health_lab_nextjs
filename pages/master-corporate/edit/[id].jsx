import { Button, InputText, Typography } from '@atoms'
import { MainLayout } from '@organisms'
import Head from 'next/head'
import React, { useState } from 'react'

const Edit = (props) => {
  const { id } = props

  const [corporateName, setCorporateName] = useState("PT. Supra Boga Lestari")
  const [corporateBrand, setCorporateBrand] = useState("Ranchmarket")
  const [corporateCode, setCorporateCode] = useState("CRP001")
  const [type, setType] = useState([
    {
      id: 1,
      type: "Corporate"
    },
    {
      id: 2,
      type: "Individual"
    }
  ])
  const [address, setAddress] = useState("Jl. Setiabudi")
  const [phone, setPhone] = useState("021-11223344 ")
  const [categories, setCategories] = useState("Supplier")
  const [totalUser, setTotalUser] = useState(3000)
  const [province, setProvince] = useState("DKI Jakarta")
  const [district, setDistrict] = useState("Kemanggisan")
  const [city, setCity] = useState("Jakarta")
  const [subdistrict, setSubdistrict] = useState("Palmerah")

  const [rt, setRt] = useState("1")
  const [rw, setRw] = useState("1")
  const [taxID, setTaxID] = useState("111.222.333.444.")
  const [picName1, setPicName1] = useState("Ahmad")
  const [titlePic1, setTitlePic1] = useState("HRD Supervisor")
  const [contactPic1, setContactPic1] = useState("+62 81234512464")
  const [emailPic1, setEmailPic1] = useState("andi@ranchmarket.com ")
  const [picName2, setPicName2] = useState("Budi")
  const [titlePic2, setTitlePic2] = useState("Finance Manager")
  const [contactPic2, setContactPic2] = useState("+62812345124544")
  const [emailPic2, setEmailPic2] = useState("budi@ranchmarket.com ")
  const [arDueDays, setArDueDays] = useState("14")

  const handleSave = () => {
  }

  return (
    <>
      <Head>
        <title>
          Bumame CMS
        </title>
      </Head>

      <MainLayout
        height={'h-full'}
        pBottom={'pb-16'}
        headline={'Master Corporate List'}
        breadcrumb={[
          {
            link: '/master-corporate',
            name: 'List Master Corporate'
          },
          {
            link: `/master-corporate/edit/${id}`,
            name: 'Edit'
          }
        ]}
      >
        <main className={'flex flex-col bg-white rounded-lg shadow-lg p-7'}>
          <div className='flex justify-start'>
            <div className='w-[380px]'>
              <InputText
                value={corporateName}
                onChange={e => setCorporateName(e.target.value)}
                label={'Nama Perusahaan'}
                type={'text'}
              />
              <InputText
                label={'Brand Perusahaan'}
                type={'text'} value={corporateBrand}
                onChange={e => setCorporateBrand(e.target.value)}
              />
              <InputText
                label={'Kode Perusahaan'}
                type={'text'} value={corporateCode}
                onChange={e => setCorporateCode(e.target.value)}
              />
              <div  className='my-2'>
                <label className=''>Type</label>
                <select className='bg-[#C9CFD6] rounded p-2 focus:outline-none border w-full' name="type" id="">
                  { type.map((item) => (
                    <option className='bg-white' selected={item.type} key={item.id} value="select">{ item.type }</option>
                  ))}
                </select>
              </div>
              <InputText
                label={'Alamat'}
                type={'text'} value={address}
                onChange={e => setAddress(e.target.value)}
              />
              <InputText
                label={'Phone'}
                type={'text'} value={phone}
                onChange={e => setPhone(e.target.value)}
              />
              <InputText 
                label={'Categories'}
                type={'text'} value={categories}
                onChange={e => setCategories(e.target.value)}
              />
              <InputText 
                label={'Total User'}
                type={'text'} value={totalUser}
                onChange={e => setTotalUser(e.target.value)}
              />
              <InputText 
                label={'Province'}
                type={'text'} value={province}
                onChange={e => setProvince(e.target.value)}
              />
              <InputText 
                label={'District'}
                type={'text'} value={district}
                onChange={e => setDistrict(e.target.value)}
              />
              <InputText
                label={'City'}
                type={'text'} value={city}
                onChange={e => setCity(e.target.value)}
              />
              <InputText
                label={'Subdistrict'}
                type={'text'} value={subdistrict}
                onChange={e => setSubdistrict(e.target.value)}
              />
            </div>
            <div className='w-[380px] ml-14'>
              <InputText 
                label={'RT'}
                type={'text'} value={rt}
                onChange={e => setRt(e.target.value)}
              />
              <InputText 
                label={'RW'}
                type={'text'} value={rw}
                onChange={e => setRw(e.target.value)}
              />
              <InputText 
                label={'Tax ID'}
                type={'text'} value={taxID}
                onChange={e => setTaxID(e.target.value)}
              />
              <InputText 
                label={'PIC Name 1'}
                type={'text'} value={picName1}
                onChange={e => setPicName1(e.target.value)}
              />
              <InputText 
                label={'Title PIC 1'}
                type={'text'} value={titlePic1}
                onChange={e => setTitlePic1(e.target.value)}
              />
              <InputText 
                label={'Contact PIC 1'}
                type={'text'} value={contactPic1}
                onChange={e => setContactPic1(e.target.value)}
              />
              <InputText 
                label={'Email PIC 1'}
                type={'text'} value={emailPic1}
                onChange={e => setEmailPic1(e.target.value)}
              />
              <InputText 
                label={'PIC Name 2'}
                type={'text'} value={picName2}
                onChange={e => setPicName2(e.target.value)}
              />
              <InputText 
                label={'Title PIC 2'}
                type={'text'} value={titlePic2}
                onChange={e => setTitlePic2(e.target.value)}
              />
              <InputText 
                label={'Contact PIC 2'}
                type={'text'} value={contactPic2}
                onChange={e => setContactPic2(e.target.value)}
              />
              <InputText 
                label={'Email PIC 2'}
                type={'text'} value={emailPic2}
                onChange={e => setEmailPic2(e.target.value)}
              />
              <InputText 
                label={'AR Due Days'}
                type={'text'} value={arDueDays}
                onChange={e => setArDueDays(e.target.value)}
              />
            </div>
          </div>
          <div className='flex justify-center mt-4'>
            <Button
              paddingVertical={`py-2`}
              paddingHorizontal={`px-7`}
              background={`bg-btnBlue`}
              onClick={handleSave}
            >
              <Typography className={`text-white font-normal text-sm`}>
                Create
              </Typography>
            </Button>
            <Button
              paddingVertical={`py-2`}
              paddingHorizontal={`px-7`}
              background={`bg-[#DDDDDD]`}
              className={'ml-3'}
              onClick={handleSave}
            >
              <Typography className={`font-normal text-sm`}>
                Cancel
              </Typography>
            </Button>
          </div>
        </main>
      </MainLayout>
    </>
  )
}

export default Edit