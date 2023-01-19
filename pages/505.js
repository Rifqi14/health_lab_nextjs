import Link from 'next/link';

export default function Custom404() {
  return (
    <div className='flex-container'>
      <div className='text-center'>
        <h1 className='title'>
          <span className='fade-in' id='digit1'>
            5
          </span>
          <span className='fade-in' id='digit2'>
            0
          </span>
          <span className='fade-in' id='digit3'>
            0
          </span>
        </h1>
        <h3 className='fadeIn'>INTERNAL SERVER ERROR</h3>
        <Link href='/'>
          <button type='button' name='button' className='custom404'>
            Return To Home
          </button>
        </Link>
      </div>
    </div>
  );
}
