import Cookies from 'js-cookie';

const TokenKey = "authToken";
const USERNAMEKEY = "userName";

const cookieAuthInfo =
  Object.defineProperties<{ token?: string, username?: string }>(
    {},
    {
      token: {
        get: () => Cookies.get(TokenKey),
        set: value => value ? Cookies.set(TokenKey, value) : Cookies.remove(TokenKey),
        configurable: false
      },
      username: {
        get: () => Cookies.get(USERNAMEKEY),
        set: value => value ? Cookies.set(USERNAMEKEY, value) : Cookies.remove(USERNAMEKEY),
        configurable: false
      }
    }
  );

export default cookieAuthInfo
