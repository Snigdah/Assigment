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

const Index = () => {
  const { user, runningAuth, handleLogOut } = useContext(AuthContext);
  const [userData, setUserData] = useState<any>();
  const [visible, setVisible] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!user && !runningAuth) {
      // if the users not already, redirecting him to login
      router.push('/login');
    } else if (user && !runningAuth) {
      router.push('/dashboard');
    }
  }, [user, runningAuth]);
  return (
    <>
      <div style={{ position: 'fixed', top: '30%', left: '48%' }}>
        <Spin size="large" />
      </div>
    </>
  );
};

export default Index;
