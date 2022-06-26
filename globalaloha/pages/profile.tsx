import React, { useEffect, useState, useContext } from 'react';
import { Button, Popover, Checkbox, Form, Input, Image, Spin } from 'antd';
import { Col, Row, Typography } from 'antd';
import axios from 'axios';
export const ApplicationId = 'e1e0322c-acb0-4a24-958c-23b2ad912a2c';
export const TenantId = 'af3baf1d-7aae-462c-9d1e-051cef459b86';
export const RoleId = '67d38259-1de5-4434-aaf7-d69fe827109f';
const { Title, Text } = Typography;
import { useRouter } from 'next/router';
import { AuthContext } from '../src/auth/auth-context';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
const { Header, Sider, Content } = Layout;
import { BoxPlotOutlined } from '@ant-design/icons';

const App = () => {
  const router = useRouter();
  const { pid } = router.query;

  console.log(pid);
  const { user, runningAuth, handleLogOut } = useContext(AuthContext);
  const [userData, setUserData] = useState<any>();

  useEffect(() => {
    if (!user && !runningAuth) {
      // if the users not already, redirecting him to login
      router.push('/login');
    } else if (user && !runningAuth) {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      };

      axios
        .get(
          `https://api-profileservice-dev.saams.xyz/v2/profile/parent-privileged/${user.appID}/${user.userID}`,
          config,
        )
        .then((res) => {
          console.log('User Data', res.data);
          setUserData(res.data);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [user, runningAuth]);

  return (
    <>
      {runningAuth ||
      !user ||
      !userData ||
      // 👈 null and undefined check
      Object.keys(userData).length === 0 ? (
        <div style={{ position: 'fixed', top: '30%', left: '48%' }}>
          <Spin size="large" />
        </div>
      ) : (
        <div className="bg-gray-100">
          <div className="w-full text-white bg-main-color">
            <div
              x-data="{ open: false }"
              className="flex flex-col max-w-screen-xl px-4 mx-auto md:items-center md:justify-between md:flex-row md:px-6 lg:px-8"
            >
              <div className="p-4 flex flex-row items-center justify-between">
                <a
                  href="/dashboard"
                  className="text-lg text-black underline font-semibold tracking-widest uppercase rounded-lg focus:outline-none focus:shadow-outline"
                >
                  Back
                </a>
                <button className="md:hidden rounded-lg focus:outline-none focus:shadow-outline">
                  <svg
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    className="w-6 h-6"
                  >
                    <path
                      x-show="!open"
                      fill-rule="evenodd"
                      d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
                      clip-rule="evenodd"
                    ></path>
                    <path
                      x-show="open"
                      fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="container mx-auto my-5 p-5">
            <div className="md:flex no-wrap md:-mx-2 ">
              <div className="w-full md:w-3/12 md:mx-2">
                <div className="bg-white p-3 border-t-4 border-green-400">
                  <div className="image overflow-hidden">
                    <img
                      className="h-auto w-full mx-auto"
                      src={userData.coverPhoto}
                      alt=""
                    />
                  </div>
                  <h1 className="text-gray-900 font-bold text-xl leading-8 my-1">
                    {userData.firstName} {userData.lastName}
                  </h1>
                </div>
                <div className="my-4"></div>
              </div>
              <div className="w-full md:w-9/12 mx-2 h-64">
                <div className="bg-white p-3 shadow-sm rounded-sm">
                  <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
                    <span className="text-green-500">
                      <svg
                        className="h-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </span>
                    <span className="tracking-wide">About</span>
                  </div>
                  <div className="text-gray-700">
                    <div className="grid md:grid-cols-2 text-sm">
                      <div className="grid grid-cols-2">
                        <div className="px-4 py-2 font-semibold">Name</div>
                        <div className="px-4 py-2"> {userData.firstName}</div>
                      </div>

                      <div className="grid grid-cols-2">
                        <div className="px-4 py-2 font-semibold">Email</div>
                        <div className="px-4 py-2"> {userData.email}</div>
                      </div>
                      <div className="grid grid-cols-2">
                        <div className="px-4 py-2 font-semibold">Gender</div>
                        <div className="px-4 py-2">{userData.gender}</div>
                      </div>
                      <div className="grid grid-cols-2">
                        <div className="px-4 py-2 font-semibold">BirthDay</div>
                        <div className="px-4 py-2">{userData.birthDay}</div>
                      </div>
                      <div className="grid grid-cols-2">
                        <div className="px-4 py-2 font-semibold">City</div>
                        <div className="px-4 py-2">{userData.city}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="my-4"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default App;
