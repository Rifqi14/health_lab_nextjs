import { authLogin } from 'components/store/actions';
import { Label } from 'components/atoms';
import { Field, Form, Formik } from 'formik';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import assets from '../public';
import { CHANGE_SIDEBAR_MODE } from 'components/constants/Sidebar';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, seterrorMessage] = useState(false);
  const [disable, setDisabled] = useState(false);
  const [data, setData] = useState({
    email: '',
    password: ''
  });
  const { user, error } = useSelector(state => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleChange = e => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    });
  };

  const submitForm = async e => {
    // e.preventDefault();
    router.push('/');
    dispatch({ type: CHANGE_SIDEBAR_MODE, payload: true });
    // dispatch(authLogin(data)).then(res => {
    //   if (res?.statusCode === 200) {
    //   }
    //   if (res?.statusCode !== 200) {
    //     seterrorMessage(true);
    //   }
    // });
  };

  const disabledButton = () => {
    if (data.email !== '' && data.password !== '') {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  };

  // useEffect(() => {
  //   if (user) {
  //     router.push('/');
  //   }
  //   disabledButton();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [router, user, data]);

  return (
    <>
      <Head>
        <title>Health Lab CMS | Login</title>
        <link
          rel='icon'
          href={`${
            process.env.NEXT_PUBLIC_PREFIX_URL || '/housecall'
          }/favicon.ico`}
        />
      </Head>
      <div className='h-screen w-screen flex justify-between'>
        <div className='bg-[#F67612] w-full h-full flex flex-col justify-end items-center'>
          <Image src={assets.Imagelogin} alt='ilustration' />
        </div>
        <div className='h-full w-full flex flex-col justify-between bg-[#FFF]'>
          <div className='flex flex-col justify-center mt-20'>
            <Image src={assets.FavIconSVG} alt='logo-Health Lab' />
            <div className='flex justify-center items-center font-bold gap-2'>
              <p className=''>Corporate</p>
              <Image src={assets.Ellipse} alt='' />
              <p>House Call</p>
              <Image src={assets.Ellipse} alt='' />
              <p>Lab Partner</p>
            </div>
            <p className='text-center my-14'>
              Welcome! Please login to your account
            </p>
            <div className='flex justify-center'>
              <Formik initialValues={data}>
                {formik => {
                  return (
                    <Form className='flex flex-col'>
                      <div className='w-[350px]'>
                        <Label>Email</Label>
                        <div className='border border-gray-400 rounded-md'>
                          <Field
                            type={'email'}
                            name={'email'}
                            className={`w-full rounded-md p-2 focus:outline-none`}
                            value={data.email}
                            onChange={handleChange}
                          />
                        </div>
                        {errorMessage === true ? (
                          <div className='mt-2 text-sm text-red-600 dark:text-red-500'>
                            Invalid email or password
                          </div>
                        ) : null}
                      </div>
                      <div className='mt-2'>
                        <Label>Password</Label>
                        <div className='flex items-center justify-between border pr-2 border-gray-400 rounded-md '>
                          <Field
                            type={showPassword ? 'text' : 'password'}
                            placeholder=''
                            name='password'
                            className={`w-full rounded-md p-2 focus:outline-none`}
                            value={data.password}
                            onChange={handleChange}
                          />
                          {showPassword ? (
                            <Image
                              src={assets.EyeOpen}
                              alt='show password'
                              className='hover:cursor-pointer'
                              onClick={() => {
                                setShowPassword(!showPassword);
                              }}
                            />
                          ) : (
                            <Image
                              src={assets.EyeClose}
                              alt='hide password'
                              className='hover:cursor-pointer'
                              onClick={() => {
                                setShowPassword(!showPassword);
                              }}
                            />
                          )}
                        </div>
                        {errorMessage === true ? (
                          <div className='mt-2 text-sm text-red-600 dark:text-red-500'>
                            Invalid email or password
                          </div>
                        ) : null}
                      </div>
                      <button
                        className='bg-btnBlue disabled:bg-gray-400 rounded-md p-2 text-white mt-8'
                        onClick={() => submitForm()}
                      >
                        LOGIN
                      </button>
                    </Form>
                  );
                }}
              </Formik>
            </div>
            <div className='text-center mt-8 font-medium text-[#6C6D76]'>
              <Link href={`/forgot-password`}>Forgot Password</Link>
            </div>
          </div>
          <p className='text-[#959CB6] text-center py-4'>
            ©️{new Date().getFullYear()} PT. Health Lab.
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
