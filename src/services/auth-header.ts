export default function authHeader() {
  const stringUser = localStorage.getItem('user');
  let user;
  if(stringUser) {
    user = JSON.parse(stringUser);
  }

  if (user && user.accessToken) {
    return { 'x-access-token': user.accessToken };
  } else {
    return {};
  }
}