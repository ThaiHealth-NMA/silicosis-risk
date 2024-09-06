export const setToken = (token) => {
  const expiration = new Date().getTime() + 60 * 60 * 1000;
  localStorage.setItem("token", JSON.stringify({ token, expiration }));
};

export const getToken = () => {
  const tokenData = localStorage.getItem("token");
  if (tokenData) {
    const { token, expiration } = JSON.parse(tokenData);
    if (new Date().getTime() < expiration) {
      return token;
    } else {
      localStorage.removeItem("token");
    }
  }
  return null;
};

export const removeToken = () => {
  localStorage.removeItem("token");
};
