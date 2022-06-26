/* eslint-disable react-hooks/rules-of-hooks */
import User from './user.model';
import useStorage from './useStorage';
import jwt_decode from 'jwt-decode';

export default class AuthHelper {
  static setDeviceId(deviceId: string) {
    window && window.localStorage.setItem('deviceId', deviceId);
  }

  static getDeviceId() {
    return window && window.localStorage.getItem('deviceId');
  }

  static setPlatformInfo(platform: unknown) {
    window && window.localStorage.setItem('platform', JSON.stringify(platform));
  }

  static getPlatformInfo() {
    return JSON.parse(localStorage.getItem('platform') ?? '');
  }

  static setToken({
    auth_token, //access_token
    refresh_token,
  }: {
    auth_token: any;
    refresh_token: any;
  }) {
    const { setItem } = useStorage();

    const authToken = {
      auth_token: auth_token,
      createdAt: new Date(new Date().toUTCString()),
    };
    const tokenDecoded: any = jwt_decode(auth_token);

    setItem('auth_token', JSON.stringify(authToken), 'local');
    setItem('refresh_token', JSON.stringify(refresh_token), 'local');
    setItem('userId', JSON.stringify(tokenDecoded._id), 'local');
  }

  static getToken() {
    const { getItem } = useStorage();
    let authToken = getItem('auth_token', 'local');
    let refreshToken = getItem('refresh_token', 'local');

    let auth = getItem('auth', 'local');
    if (auth) {
      let authObj = JSON.parse(auth);
      authToken = authObj?.state?.authToken;
      refreshToken = authObj?.state?.refreshToken;
    }

    if (authToken && refreshToken) {
      return {
        authToken,
        refreshToken,
      };
    }
    return null;
  }

  static isAuthenticated() {
    const { getItem } = useStorage();

    let auth = getItem('auth', 'local');
    if (auth) {
      let authObj = JSON.parse(auth);
      if (authObj?.state?.authToken) {
        const refreshTokenExpiryTime = authObj?.state?.refreshTokenExpiryTime;
        const decoded: any = jwt_decode(authObj?.state?.authToken);
        const tokenExpireTime = decoded?.exp * 1000;
        const currentTime = new Date().getTime();

        if (
          currentTime > tokenExpireTime || //todo: Need to remove this token expiration code when validating refresh token will be fixed.
          currentTime > refreshTokenExpiryTime
        ) {
          // console.log("Clearing Token");
          this.clearToken();
          return false;
        }
        return true;
      }
    }
    return false;
  }

  static clearToken() {
    window && window.localStorage.removeItem('auth');
  }

  // static setUser(user: any) {
  //   const { setItem } = useStorage();

  //   setItem("user", JSON.stringify(user), "local");
  //   setItem("user", JSON.stringify(user), "session");
  // }
  // static clearUser() {
  //   const { removeItem } = useStorage();
  //   removeItem("user", "local");
  // }

  static getUser() {
    const { getItem } = useStorage();

    let auth = getItem('auth', 'local');
    if (auth) {
      let authObj = JSON.parse(auth);
      if (authObj?.state?.authToken) {
        const token = authObj?.state?.authToken;
        const decoded: any = jwt_decode(token);
        return new User({
          fullName: decoded?.fullName,
        });
      }
    }

    return null;
  }

  // static getCurrentUserId() {
  //   const user = this.getUser();
  //   return user ? user?.userId : null;
  // }
}
