export const logout = (setUser) => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  setUser(false);
};
