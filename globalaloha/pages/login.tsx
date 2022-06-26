import { useEffect, useState, useContext } from 'react';
import { Button, Checkbox, Form, Input, Image, Spin } from 'antd';
import { Col, Row, Typography } from 'antd';
import axios from 'axios';
export const ApplicationId = 'e1e0322c-acb0-4a24-958c-23b2ad912a2c';
export const TenantId = 'af3baf1d-7aae-462c-9d1e-051cef459b86';
export const RoleId = '67d38259-1de5-4434-aaf7-d69fe827109f';
const { Title, Text } = Typography;
import { useRouter } from 'next/router';
import { AuthContext } from '../src/auth/auth-context';

const App = () => {
  const [username, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user, runningAuth } = useContext(AuthContext);

  const router = useRouter();

  useEffect(() => {
    console.log(runningAuth);
    if (user && !runningAuth) {
      // if the users already loggedIn, redirecting him
      router.push('/dashboard');
    }
  }, [user, runningAuth]);

  const handleSubmit = async (e) => {
    const getDeviceId = localStorage.getItem('deviceId');
    const body = {
      username,
      password,
      grant_type: 'password',
      scope: 'v2,' + ApplicationId + ',' + TenantId + ',' + getDeviceId,
      DeviceInfo: 'ebe6e74da21e44f2021c5cd056b89299',
    };

    axios
      .post(`https://api-userservice-dev.saams.xyz/oauth2/token/v2`, body, {
        headers: {
          tenant: 'root',
        },
      })
      .then((res) => {
        //setting the accesstoken on localStorage
        localStorage.setItem('accessToken', res.data.access_token);
        // if we do router.push then the user (not enough time to update the state) stays null, but runningAuth stays false (the state doesn't resets)
        window.location.href = '/dashboard';
        // router.push('/dashboard');
      })
      .catch((e) => {
        alert('Invalid Mail or password');
        console.error(e);
      });
  };

  const handleEmailChange = (e: any) => {
    setEmail(e.target.value);
  };
  const handlePassChange = (e: any) => {
    setPassword(e.target.value);
  };

  return (
    <>
      {runningAuth ? (
        <div style={{ position: 'fixed', top: '30%', left: '48%' }}>
          <Spin size="large" />
        </div>
      ) : (
        <Row>
          <Col span={12}>
            <Image
              preview={false}
              width={'100%'}
              src="https://images.pexels.com/photos/3651579/pexels-photo-3651579.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            />
          </Col>
          <Col span={12}>
            <div style={{ margin: '0 auto', marginTop: '20vh' }}>
              <Title style={{ marginLeft: '15vw', marginBottom: '5vh' }}>
                Login
              </Title>

              <Form
                name="basic"
                labelCol={{
                  span: 8,
                }}
                wrapperCol={{
                  span: 16,
                }}
                initialValues={{
                  remember: true,
                }}
                onFinish={handleSubmit}
                // onFinishFailed={onFinishFailed}
                // onSubmit={handleSubmit}
                autoComplete="off"
              >
                <Form.Item
                  label="Username"
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your username!',
                    },
                  ]}
                >
                  <Input value={username} onChange={handleEmailChange} />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your password!',
                    },
                  ]}
                >
                  <Input.Password
                    value={password}
                    onChange={handlePassChange}
                  />
                </Form.Item>

                <Form.Item
                  name="remember"
                  valuePropName="checked"
                  wrapperCol={{
                    offset: 8,
                    span: 16,
                  }}
                >
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <Form.Item
                  wrapperCol={{
                    offset: 8,
                    span: 16,
                  }}
                >
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Col>
        </Row>
      )}
    </>
  );
};

export default App;
