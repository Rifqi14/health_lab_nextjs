import {
  Button,
  Card,
  Input,
  InputFile,
  Label,
  Textarea,
  TimePicker,
  Typography,
  DateInput
} from 'components/atoms';
import { Transition } from '@headlessui/react';
import { EmptyTable, TimeRangePicker } from 'components/molecules';
import React, { useEffect, useRef, useState } from 'react';
import Table from '../Tables/Table';

const HouseCallCorporate = props => {
  const { setIsOpenConfirmationDialog, isHouseCallCorporateFormOpen } = props;
  const form = useRef(null);
  const [state, setState] = useState({
    initialTable: [
      { no: 1, payment_code: '-', patient_name: '', nik: '' },
      { no: 2, payment_code: '-', patient_name: '', nik: '' },
      { no: 3, payment_code: '-', patient_name: '', nik: '' },
      { no: 4, payment_code: '-', patient_name: '', nik: '' },
      { no: 5, payment_code: '-', patient_name: '', nik: '' }
    ],
    startBooking: new Date(),
    endBooking: new Date(),
    spkFileName: '',
    penawaranFileName: '',
    npwpFileName: '',
    ktpFileName: '',
    vendorFileName: ''
  });

  const onChangeFile = value => {
    switch (value.target.name) {
      case 'spk':
        state.spkFileName = value.target.files && value.target.files[0].name;
        break;
      case 'offering_price':
        state.penawaranFileName =
          value.target.files && value.target.files[0].name;
        break;
      case 'npwp':
        state.npwpFileName = value.target.files && value.target.files[0].name;
        break;
      case 'id_card':
        state.ktpFileName = value.target.files && value.target.files[0].name;
        break;
      case 'vendor_letter':
        state.vendorFileName = value.target.files && value.target.files[0].name;
        break;
    }
    setState({
      ...state
    });
  };

  const onChangeStartBooking = value => {
    setState({
      ...state,
      startBooking: value,
      endBooking: new Date(state.endBooking) < new Date(value) && value
    });
  };

  const onChangeEndBooking = value => {
    setState({
      ...state,
      endBooking:
        new Date(state.startBooking) > new Date(value)
          ? state.startBooking
          : value
    });
  };

  const headColumns = [
    {
      key: 'no',
      name: 'No'
    },
    {
      key: 'payment_code',
      name: 'Payment Code',
      className: 'text-left'
    },
    {
      key: 'patient_name',
      name: 'Nama Pasien',
      className: 'text-left'
    },
    {
      key: 'nik',
      name: 'NIK',
      className: 'text-left'
    }
  ];

  return (
    <Transition appear show={isHouseCallCorporateFormOpen}>
      <Card className={`mb-5`}>
        <div
          className={`w-full h-full overflow-x-auto space-y-[16px] flex flex-col rounded border border-[#E6E6E6]`}
        >
          <Table headColumns={headColumns}>
            {state.initialTable.length > 0 ? (
              state.initialTable.map((item, key) => {
                return (
                  <tr
                    key={key}
                    className={`text-center odd:bg-[#FCFCFC] even:bg-white`}
                  >
                    <td className={`py-6 px-6`}>
                      <Typography>{item.no}</Typography>
                    </td>
                    <td className={`text-left`}>
                      <Typography>{item.payment_code}</Typography>
                    </td>
                    <td className={`pr-7`}>
                      <Input
                        value={item.patient_name}
                        name={item.payment_code}
                      />
                    </td>
                    <td className={`pr-7`}>
                      <Input value={item.nik} name={item.payment_code} />
                    </td>
                  </tr>
                );
              })
            ) : (
              <EmptyTable colSpan={4} title={`List House Calls Empty`} />
            )}
          </Table>
        </div>
        <div
          className={`grid gap-x-16 gap-y-5 grid-cols-1 mb-6 lg:grid-cols-3 pt-6`}
        >
          <div>
            <Typography className={`font-medium text-lg`}>
              Data Information
            </Typography>
          </div>
          <div></div>
          <div></div>
          <div>
            <Label htmlFor={'pic'}>PIC</Label>
            <Input
              type={`text`}
              id={`pic`}
              placeholder={`PIC`}
              name={`pic`}
              disabled
              value={`Ahmad`}
            />
          </div>
          <div>
            <Label htmlFor={'cost'}>Biaya dll</Label>
            <Input
              type={`text`}
              id={`cost`}
              placeholder={`Biaya dll`}
              name={`cost`}
              value={`1.000.000`}
            />
          </div>
          <div></div>
          <div>
            <Label htmlFor={'address'}>Alamat</Label>
            <Input
              type={`text`}
              id={`address`}
              placeholder={`Alamat`}
              name={`address`}
              disabled
              value={`Jl. Setiabudi No. 6`}
            />
          </div>
          <div>
            <Label htmlFor={'description'}>Description</Label>
            <Textarea
              name={`description`}
              id={`description`}
              rows={3}
            ></Textarea>
          </div>
          <div></div>
        </div>
        <div
          className={`grid gap-x-16 gap-y-5 grid-cols-1 mb-6 lg:grid-cols-3 pt-6`}
        >
          <div>
            <Typography className={`font-medium text-lg`}>
              Action Schedule
            </Typography>
          </div>
          <div></div>
          <div></div>
          <div>
            <Label htmlFor={'medical_worker'}>Tenaga Kesehatan</Label>
            <Input
              type={`text`}
              id={`medical_worker`}
              placeholder={`Tenaga Kesehatan`}
              name={`medical_worker`}
              value={`Ahmad`}
            />
          </div>
          <div></div>
          <div></div>
          <div>
            <Label htmlFor={'booking_date'}>Booking Date</Label>
            <DateInput name={`booking_date`} />
          </div>
          <div>
            <Label htmlFor={'booking_time'}>Booking Time</Label>
            <div
              className={`flex items-center border rounded-lg border-[#C9CFD6]`}
            >
              <div className={`w-14`}>
                <TimePicker
                  name={`start`}
                  onChange={onChangeStartBooking}
                  selectedTime={state.startBooking}
                />
              </div>
              <span className={`px-1`}>-</span>
              <div className={`w-14`}>
                <TimePicker
                  name={`end`}
                  onChange={onChangeEndBooking}
                  selectedTime={state.endBooking}
                  minTime={state.startBooking}
                />
              </div>
            </div>
          </div>
          <div></div>
        </div>
        <div
          className={`grid gap-x-16 gap-y-5 grid-cols-1 mb-6 lg:grid-cols-3 pt-6`}
        >
          <div>
            <Typography className={`font-medium text-lg`}>
              Supporting Data
            </Typography>
          </div>
          <div></div>
          <div></div>
          <div>
            <Label htmlFor={'spk'}>SPK</Label>
            <InputFile
              hiddenFileInput={form}
              onChange={onChangeFile}
              fileName={state.spkFileName}
              name={`spk`}
            />
          </div>
          <div>
            <Label htmlFor={'offering_price'}>Surat Penawaran Harga</Label>
            <InputFile
              hiddenFileInput={form}
              onChange={onChangeFile}
              fileName={state.penawaranFileName}
              name={`offering_price`}
            />
          </div>
          <div></div>
          <div>
            <Label htmlFor={'npwp'}>NPWP</Label>
            <InputFile
              hiddenFileInput={form}
              onChange={onChangeFile}
              fileName={state.npwpFileName}
              name={`npwp`}
            />
          </div>
          <div>
            <Label htmlFor={'id_card'}>
              Data ID (KTP/Passport) karyawaan yang di swab
            </Label>
            <InputFile
              hiddenFileInput={form}
              onChange={onChangeFile}
              fileName={state.ktpFileName}
              name={`id_card`}
            />
          </div>
          <div></div>
          <div>
            <Label htmlFor={'vendor_letter'}>Surat Vendor</Label>
            <InputFile
              hiddenFileInput={form}
              onChange={onChangeFile}
              fileName={state.vendorFileName}
              name={`vendor_letter`}
            />
          </div>
        </div>
        <div
          className={`grid gap-x-16 gap-y-5 grid-cols-1 mb-6 lg:grid-cols-3 pt-6`}
        >
          <div></div>
          <div>
            <Button
              className={`bg-btnBlue rounded-lg hover:bg-[#008AEC] text-white mr-6`}
              onClick={() => {
                setIsOpenConfirmationDialog(true);
              }}
            >
              <Typography className={`font-normal text-sm`}>Save</Typography>
            </Button>
            <Button
              className={`bg-[#DDDDDD] rounded-lg hover:bg-[#C6C6C6] text-black`}
            >
              <Typography>Cancel</Typography>
            </Button>
          </div>
          <div></div>
        </div>
      </Card>
    </Transition>
  );
};

export default HouseCallCorporate;
