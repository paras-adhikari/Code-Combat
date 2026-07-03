import React from 'react';
import ContestCreation from './ContestCreation';

const Battle = () => {
  return (
    <div className='w-screen h-screen relative flex items-center justify-center overflow-x-hidden'>
      <div className='relative z-10 w-3/4 p-4 '>
        <ContestCreation />
      </div>
    </div>
  );
};

export default Battle;
