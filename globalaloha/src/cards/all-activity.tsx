import React from 'react';
import CardImage from './card-img';
import { Spin } from 'antd';

const AllActivity = (props) => {
  const { data } = props;

  return (
    <>
      {!data.length ? (
        <div style={{ position: 'fixed', top: '30%', left: '48%' }}>
          <Spin size="large" />
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {data.map((d, i) => (
            <div className="flex h-screen items-center justify-center px-4">
              <div className="max-w-sm overflow-hidden rounded-xl bg-white shadow-md duration-200 hover:scale-105 hover:shadow-xl">
                <a href={`/activity/${d.ActivityId}`} key={i}>
                  <CardImage
                    style={{ width: '384px', height: '255px' }}
                    imgSrcOrg={d.Photo}
                    alt="plant"
                    className="h-auto w-full"
                  />
                </a>

                <div className="p-5">
                  <a href={`/activity/${d.ActivityId}`} key={i}>
                    <h2 className="mb-5 text-gray-700">{d.Title}</h2>
                    <div className="grid grid-cols-2 gap-5">
                      <p>MemberCount: {d.MemberCount}</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default AllActivity;
