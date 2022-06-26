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
import IndiActivity from '../src/cards/indi-activity';
import AllGroup from '../src/cards/all-group';
import AllActivity from '../src/cards/all-activity';
import IndiGroup from '../src/cards/indi-group';

const App = () => {
  const { user, runningAuth, handleLogOut } = useContext(AuthContext);
  const [userData, setUserData] = useState<any>();
  const [allGroupData, setAllGroupData] = useState({ data: [], count: 0 });
  const [allActivityData, setAllActivityData] = useState({
    data: [],
    count: 0,
  });
  const [indiGroupData, setIndiGroupData] = useState({ data: [], count: 0 });
  const [indiActivityData, setIndiActivityData] = useState({
    data: [],
    count: 0,
  });
  const [visible, setVisible] = useState(false);
  const [userRecentActivity, setUserRecentActivity] = useState([]);
  const [stateShowing, setStateShowing] = useState<
    'groupAll' | 'groupIndi' | 'activityAll' | 'activityIndi'
  >('groupAll');
  const [pageIndex, setPageIndex] = useState({ clicked: false, index: 0 });

  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
    if (router.query.show) {
      // @ts-expect-error
      setStateShowing(router.query.show);
    }
    console.log('query', router.query.show);
  }, [router.isReady]);

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
          console.log('USER DATA', res);
          setUserData(res.data);
        })
        .catch((e) => {
          console.error(e);
        });

      handleFetchIndiActivity(0);
      handleFetchIndiGroup(0);
      handleFetchActivityAll(0);
      handleFetchAllGroup(0);

      // Getting User Activity Data
      axios
        .get(
          `https://api-globalalohaservice-dev.saams.xyz/v1/activity/recent?userid=${user.userID}&limit=5`,
          {
            headers: {
              authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          },
        )
        .then((res) => {
          console.log('RECENTS ', res.data);
          setUserRecentActivity(res.data);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [user, runningAuth]);

  const handleFetchIndiActivity = (pageIndex: number) => {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    };
    axios
      .get(
        `https://api-globalalohaservice-dev.saams.xyz/v1/activity/user/${user.userID}/activity?pageIndex=-${pageIndex}&pageSize=12&filterActivityType=-1`,
        config,
      )
      .then((res) => {
        console.log('User Activity ', res);
        setIndiActivityData({ data: res.data.Items, count: res.data.Count });
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handleFetchIndiGroup = (pageIndex: number) => {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    };
    axios
      .get(
        `https://api-gagroupservice-dev.saams.xyz/api/v1/group?pageSize=12&pageNum=${pageIndex}&userId=${user.userID}`,
        config,
      )
      .then((res) => {
        console.log('User Group ', res);
        setIndiGroupData({ data: res.data.Groups, count: res.data.TotalCount });
        // setUserData(res.data);
      })
      .catch((e) => {
        console.error('User Group ', e);
      });
  };

  const handleFetchAllGroup = (pageIndex: number) => {
    axios
      .get(
        `https://api-gagroupservice-dev.saams.xyz/api/v1/group/library?pageIndex=${pageIndex}&pageSize=12&applicationId=e1e0322c-acb0-4a24-958c-23b2ad912a2c&tenantId=af3baf1d-7aae-462c-9d1e-051cef459b86`,
      )
      .then((res) => {
        console.log('all groups ', res);
        console.log('sdfa asss', {
          data: res.data.Groups,
          count: res.data.TotalCount,
        });
        setAllGroupData({ data: res.data.Groups, count: res.data.TotalCount });
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handleFetchActivityAll = (pageIndex: number) => {
    axios
      .post(
        `https://api-globalalohaservice-dev.saams.xyz/v1/activity/library?pageIndex=${pageIndex}&pageSize=12`,
        {},
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        },
      )
      .then((res) => {
        console.log('Activity All', res);
        setAllActivityData({ data: res.data.Items, count: res.data.Count });
      })
      .catch((e) => {
        console.error('Activity All', e);
      });
  };

  // For the pagination
  useEffect(() => {
    console.log(pageIndex.index);
    if (pageIndex.clicked) {
      if (stateShowing === 'activityAll') {
        setAllActivityData({
          data: [],
          count: 0,
        });
        handleFetchActivityAll(pageIndex.index);
      } else if (stateShowing === 'activityIndi') {
        setIndiActivityData({
          data: [],
          count: 0,
        });

        handleFetchIndiActivity(pageIndex.index);
      } else if (stateShowing === 'groupAll') {
        setAllGroupData({
          data: [],
          count: 0,
        });
        handleFetchAllGroup(pageIndex.index);
      } else if (stateShowing === 'groupIndi') {
        setIndiGroupData({
          data: [],
          count: 0,
        });
        handleFetchIndiGroup(pageIndex.index);
      }
    }
  }, [pageIndex]);

  const hidePopOver = () => {
    setVisible(false);
  };

  const handlePopOverVisibleChange = (newVisible: boolean) => {
    setVisible(newVisible);
  };

  return (
    <>
      {runningAuth || !user || !userData || !allGroupData.data.length ? (
        <div style={{ position: 'fixed', top: '30%', left: '48%' }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <div>
            <nav className="bg-white border-b border-gray-200 fixed z-30 w-full">
              <div className="px-3 py-3 lg:px-5 lg:pl-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center justify-start">
                    <button
                      id="toggleSidebarMobile"
                      aria-expanded="true"
                      aria-controls="sidebar"
                      className="lg:hidden mr-2 text-gray-600 hover:text-gray-900 cursor-pointer p-2 hover:bg-gray-100 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100 rounded"
                    >
                      <svg
                        id="toggleSidebarMobileHamburger"
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      <svg
                        id="toggleSidebarMobileClose"
                        className="w-6 h-6 hidden"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </button>

                    <img
                      src="https://demo.themesberg.com/windster/images/logo.svg"
                      className="h-6 mr-2"
                      alt="Windster Logo"
                    />
                    <span className="self-center whitespace-nowrap">
                      Global Aloha
                    </span>
                    <form
                      action="#"
                      method="GET"
                      className="hidden lg:block lg:pl-32"
                    >
                      <label htmlFor="topbar-search" className="sr-only">
                        Search
                      </label>
                      <div className="mt-1 relative lg:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg
                            className="w-5 h-5 text-gray-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </div>
                        <input
                          type="text"
                          name="email"
                          id="topbar-search"
                          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full pl-10 p-2.5"
                          placeholder="Search"
                        />
                      </div>
                    </form>

                    <svg
                      className="w-6 h-6 text-gray-500 flex-shrink-0 group-hover:text-gray-900 transition duration-75"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path>
                    </svg>
                    <span
                      onClick={() => {
                        setStateShowing('activityAll');
                        router.push({
                          query: { show: 'activityAll' },
                        });
                      }}
                      className={
                        stateShowing === 'activityAll'
                          ? 'text-blue-500 ml-3 cursor-pointer hover:underline'
                          : 'ml-3 cursor-pointer hover:underline'
                      }
                    >
                      Activity Library
                    </span>

                    <svg
                      className="w-6 h-6 text-gray-500 flex-shrink-0 group-hover:text-gray-900 transition duration-75"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span
                      onClick={() => {
                        setStateShowing('groupAll');
                        router.push({
                          query: { show: 'groupAll' },
                        });
                      }}
                      className={
                        stateShowing === 'groupAll'
                          ? 'text-blue-500 ml-3 cursor-pointer hover:underline'
                          : 'ml-3 cursor-pointer hover:underline'
                      }
                    >
                      Groups
                    </span>
                  </div>
                  <div className="flex items-center">
                    <button
                      id="toggleSidebarMobileSearch"
                      type="button"
                      className="lg:hidden text-gray-500 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-lg"
                    >
                      <span className="sr-only">Search</span>
                      <svg className="svg-icon" viewBox="0 0 20 20">
                        <path d="M12.075,10.812c1.358-0.853,2.242-2.507,2.242-4.037c0-2.181-1.795-4.618-4.198-4.618S5.921,4.594,5.921,6.775c0,1.53,0.884,3.185,2.242,4.037c-3.222,0.865-5.6,3.807-5.6,7.298c0,0.23,0.189,0.42,0.42,0.42h14.273c0.23,0,0.42-0.189,0.42-0.42C17.676,14.619,15.297,11.677,12.075,10.812 M6.761,6.775c0-2.162,1.773-3.778,3.358-3.778s3.359,1.616,3.359,3.778c0,2.162-1.774,3.778-3.359,3.778S6.761,8.937,6.761,6.775 M3.415,17.69c0.218-3.51,3.142-6.297,6.704-6.297c3.562,0,6.486,2.787,6.705,6.297H3.415z"></path>
                      </svg>
                    </button>
                    <div className="hidden lg:flex items-center">
                      <Popover
                        content={
                          <>
                            {' '}
                            <img
                              className="inline object-cover w-16 h-16 mr-2 rounded-full"
                              src={userData.profilePhoto}
                              alt="Profile image"
                            />
                            <div
                              style={{ display: 'block', marginBottom: '5px' }}
                            >
                              <a href="/profile">
                                <Button type="primary">Profile</Button>
                              </a>
                            </div>
                            <div
                              style={{ display: 'block', marginBottom: '5px' }}
                            >
                              <Button
                                danger
                                type="primary"
                                onClick={handleLogOut}
                              >
                                Logout
                              </Button>
                            </div>
                            <div style={{ display: 'inline' }}>
                              <a onClick={hidePopOver}>Close</a>
                            </div>
                          </>
                        }
                        title={userData.firstName}
                        trigger="click"
                        visible={visible}
                        onVisibleChange={handlePopOverVisibleChange}
                      >
                        <Button icon={<BoxPlotOutlined />} size={'large'} />
                      </Popover>
                    </div>
                  </div>
                </div>
              </div>
            </nav>
            <div className="flex overflow-hidden bg-white pt-16">
              <aside
                id="sidebar"
                className="fixed hidden z-20 h-full top-0 left-0 pt-16 flex lg:flex flex-shrink-0 flex-col w-64 transition-width duration-75"
                aria-label="Sidebar"
              >
                <div className="relative flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white pt-0">
                  <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                    <div className="flex-1 px-3 bg-white divide-y space-y-1">
                      <ul className="space-y-2 pb-2">
                        <li>
                          <form action="#" method="GET" className="lg:hidden">
                            <label htmlFor="mobile-search" className="sr-only">
                              Search
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg
                                  className="w-5 h-5 text-gray-500"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                                </svg>
                              </div>
                              <input
                                type="text"
                                name="email"
                                id="mobile-search"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-600 focus:ring-cyan-600 block w-full pl-10 p-2.5"
                                placeholder="Search"
                              />
                            </div>
                          </form>
                        </li>
                        <li>
                          <svg
                            className="w-6 h-6 text-gray-500 group-hover:text-gray-900 transition duration-75"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                            <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                          </svg>
                          <span
                            onClick={() => {
                              setStateShowing('activityIndi');
                              router.push({
                                query: { show: 'activityIndi' },
                              });
                            }}
                            className={
                              stateShowing === 'activityIndi'
                                ? 'ml-3 cursor-pointer text-blue-500 hover:underline'
                                : 'ml-3 cursor-pointer hover:underline'
                            }
                          >
                            My Activites
                          </span>
                        </li>
                        <li>
                          <svg
                            className="w-6 h-6 text-gray-500 flex-shrink-0 group-hover:text-gray-900 transition duration-75"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                          </svg>
                          <span
                            onClick={() => {
                              setStateShowing('groupIndi');
                              router.push({
                                query: { show: 'groupIndi' },
                              });
                            }}
                            className={
                              stateShowing === 'groupIndi'
                                ? 'ml-3 flex-1 text-blue-500 hover:underline cursor-pointer whitespace-nowrap'
                                : 'ml-3 flex-1 hover:underline cursor-pointer whitespace-nowrap'
                            }
                          >
                            My Groups
                          </span>
                        </li>
                        <li className="mt-10">Recents</li>
                        {userRecentActivity.length &&
                          userRecentActivity.map((d, i) => (
                            <li key={i}>
                              <a
                                href={`/activity/${d.Id}`}
                                className="text-base text-gray-900 font-normal rounded-lg hover:bg-gray-100 flex items-center p-2 group "
                              >
                                <svg
                                  className="w-6 h-6 text-gray-500 flex-shrink-0 group-hover:text-gray-900 transition duration-75"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z"
                                    clipRule="evenodd"
                                  ></path>
                                </svg>
                                <span className="ml-3 flex-1 whitespace-nowrap">
                                  {d.Title}
                                </span>
                              </a>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </aside>
              <div
                className="bg-gray-900 opacity-50 hidden fixed inset-0 z-10"
                id="sidebarBackdrop"
              ></div>
              <div
                id="main-content"
                className="h-full w-full bg-gray-50 relative overflow-y-auto lg:ml-64"
                style={{ height: '82vh' }}
              >
                <p className="text-3xl mt-8 ml-10">
                  {stateShowing === 'groupAll'
                    ? 'Group Gallery'
                    : stateShowing === 'activityAll'
                    ? 'Activity Library'
                    : stateShowing === 'activityIndi'
                    ? 'My Activity'
                    : stateShowing === 'groupIndi'
                    ? 'My Groups'
                    : ''}
                </p>
                {stateShowing === 'groupAll' ? (
                  <AllGroup data={allGroupData.data} />
                ) : stateShowing === 'activityAll' ? (
                  <AllActivity data={allActivityData.data} />
                ) : stateShowing === 'activityIndi' ? (
                  <IndiActivity data={indiActivityData.data} />
                ) : stateShowing === 'groupIndi' ? (
                  <IndiGroup data={indiGroupData.data} />
                ) : (
                  ''
                )}
              </div>
            </div>
            {/* Pagination */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <a
                  href="#"
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  {' '}
                  Previous{' '}
                </a>
                <a
                  href="#"
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  {' '}
                  Next{' '}
                </a>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing
                    <span className="font-medium">1</span>
                    to
                    <span className="font-medium">10</span>
                    of
                    <span className="font-medium">97</span>
                    results
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <a
                      onClick={() => {
                        if (pageIndex.index > 0) {
                          router.push({
                            query: {
                              pageIndex: pageIndex.index - 1,
                              pageSize: 12,
                            },
                          });

                          setPageIndex((prevState) => ({
                            index: prevState.index - 1,
                            clicked: true,
                          }));
                        }
                      }}
                      className={
                        pageIndex.index === 0
                          ? 'relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-100 hover:bg-gray-50'
                          : 'relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50'
                      }
                    >
                      <span className="sr-only">Previous</span>
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </a>

                    {Array(
                      Math.round(
                        stateShowing === 'groupAll'
                          ? allGroupData.count / 12
                          : stateShowing === 'activityAll'
                          ? allActivityData.count / 12
                          : stateShowing === 'activityIndi'
                          ? indiActivityData.count / 12
                          : stateShowing === 'groupIndi'
                          ? indiGroupData.count / 12
                          : 12 / 12,
                      ),
                    )
                      .fill(0)
                      .map((d, i) => (
                        <a
                          onClick={() => {
                            router.push({
                              query: { pageIndex: i, pageSize: 12 },
                            });
                            setPageIndex((prevState) => ({
                              index: i,
                              clicked: true,
                            }));
                          }}
                          aria-current="page"
                          className={
                            pageIndex.index === i
                              ? `z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium`
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium'
                          }
                        >
                          {i + 1}
                        </a>
                      ))}

                    <a
                      onClick={() =>
                        setPageIndex((prevState) => ({
                          index: prevState.index + 1,
                          clicked: true,
                        }))
                      }
                      className={
                        Array(
                          Math.round(
                            stateShowing === 'groupAll'
                              ? allGroupData.count / 12
                              : stateShowing === 'activityAll'
                              ? allActivityData.count / 12
                              : stateShowing === 'activityIndi'
                              ? indiActivityData.count / 12
                              : stateShowing === 'groupIndi'
                              ? indiGroupData.count / 12
                              : 12 / 12,
                          ),
                        ).fill(0).length ===
                        pageIndex.index + 1
                          ? 'relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-100 hover:bg-gray-50'
                          : 'relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50'
                      }
                    >
                      <span className="sr-only">Next</span>
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </a>
                  </nav>
                </div>
              </div>
            </div>
            <script
              async
              defer
              src="https://buttons.github.io/buttons.js"
            ></script>
            <script src="https://demo.themesberg.com/windster/app.bundle.js"></script>
          </div>
        </>
      )}
    </>
  );
};

export default App;
