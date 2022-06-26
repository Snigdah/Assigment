import React from 'react';
import CardImage from './card-img';
import { Spin } from 'antd';

const IndiGroup = (props) => {
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
            <div
              key={i}
              className="flex h-screen items-center justify-center px-4"
            >
              <div className="max-w-sm overflow-hidden rounded-xl bg-white shadow-md duration-200 hover:scale-105 hover:shadow-xl">
                <a href={`/group/${d.Id}`}>
                  <CardImage
                    style={{ width: '384px', height: '255px' }}
                    imgSrcOrg={d.Photo}
                    alt="plant"
                    className="h-auto w-full"
                  />
                </a>

                <div className="p-5">
                  <a href={`/group/${d.ActivityId}`}>
                    <h2 className="mb-5 text-gray-700">{d.Title}</h2>
                    <div className="grid grid-cols-2 gap-5">
                      <p>Leader: {d.Leader}</p>
                      <p>RoleName: {d.RoleName ? d.RoleName : 'Unknown'}</p>
                      <p>
                        PublishToLibrary:{' '}
                        {d.PublishToLibrary ? d.PublishToLibrary : 'Unknown'}
                      </p>
                      <p>PublishToLibrary: {d.Leader ? d.Leader : 'Unknown'}</p>
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

export default IndiGroup;
