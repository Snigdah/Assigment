import React, { useState } from 'react';

const CardImage = ({ imgSrcOrg, ...props }) => {
  const [imgSrc, setImgSrc] = useState<string | undefined>(imgSrcOrg);

  const onError = () =>
    setImgSrc(
      'https://cpworldgroup.com/wp-content/uploads/2021/01/placeholder.png',
    );

  return (
    <img
      src={
        imgSrc
          ? imgSrc
          : 'https://cpworldgroup.com/wp-content/uploads/2021/01/placeholder.png'
      }
      onError={onError}
      {...props}
    />
  );
};

export default CardImage;
