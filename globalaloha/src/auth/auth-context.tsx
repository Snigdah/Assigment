import React, { useState, useEffect, createContext } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const useProvideAuth = () => {
  const [user, setUser] = useState<any>();
  const [runningAuth, setRunningAuth] = useState(true); //tracking the state of `onAuthStateChange`. We need to handle some tasks if the authentication process is still running.

  const router = useRouter();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      setRunningAuth(true);

      const body = new URLSearchParams();
      body.append('Token', accessToken);

      axios
        .post(
          `https://api-userservice-dev.saams.xyz/v2/verify?clientside=true`,
          body,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              // Content-Type: "text/plain"
              // accept: '*/*',
            },
          },
        )
        .then((res) => {
          const appID = res.data.ApplicationId;
          const userID = res.data.UserId;

          setUser({
            appID,
            userID,
            name: 'John Doe',
            profileImg:
              'https://images.unsplash.com/photo-1618331833071-ce81bd50d300?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YWJzdHJhY3QlMjBhcnR8ZW58MHx8MHx8&w=1000&q=80',
          });
          console.log('2');
          setRunningAuth(false);
        })
        .catch((e) => {
          console.error(e);
          alert('User Authentication Failed');
          console.log('3');
          setRunningAuth(false);

          //redirecting user back to login page if something goes wrong
          // router.push('/login');
        });
    } else {
      console.log('1');
      setRunningAuth(false);
    }
  }, []);

  const handleLogOut = () => {
    if (window) {
      window.localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
  };

  return {
    user,
    runningAuth,
    handleLogOut,
  };
};

export const AuthContext = createContext(undefined);

export const AuthProvider: React.FC = (props) => {
  const { children } = props;
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
