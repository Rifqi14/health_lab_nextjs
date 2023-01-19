import React from 'react';
import { Button, Input } from '@atoms';

type Props = {};

function LoginForm({}: Props) {
  return (
    <div className='px-2'>
      <Input show={true} label='Email' id='login' labelFor='login' />
      <Button
        background={`bg-bumame-secondary`}
        rounded={'5px'}
        type='submit'
        disabled={false}
        isFull={true}
        onclick={async () => alert('Bumame Login')}
        paddingVertical={'0px'}
      >
        <span className='uppercase'>Login</span>
      </Button>
    </div>
  );
}

export default LoginForm;
