import React from 'react';
import { Oval } from 'react-loader-spinner';

const Loader = () => {
  return (
    <Oval
      height={50}
      width={50}
      color="#6938EF"
      secondaryColor="#D9D6FE"
      strokeWidth={4}
      strokeWidthSecondary={4}
      ariaLabel="loading"
    />
  );
};

export default Loader;