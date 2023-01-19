import Link from 'next/link';

export default function Custom404() {
  return (
    <div className='flex-container'>
      <div className='text-center'>
        <h1 className='title'>
          <span className='fade-in' id='digit1'>
            4
          </span>
          <span className='fade-in' id='digit2'>
            0
          </span>
          <span className='fade-in' id='digit3'>
            4
          </span>
        </h1>
        <h3 className='fadeIn'>PAGE NOT FOUND</h3>
        <Link href='/'>
          <button type='button' name='button' className='custom404'>
            Return To Home
          </button>
        </Link>
      </div>
    </div>
  );
}
