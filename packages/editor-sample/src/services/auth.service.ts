import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "http://localhost:5000/api/auth";

/**
 * Đăng ký tài khoản mới
 */
export const register = async (userData: {
  studentId: string;
  email: string;
  password: string;
  studentEmail: string;
  role: string;
}) => {
  return await axios.post(`${API_URL}/register`, userData);
};

/**
 * Đăng nhập và lấy Access Token & Refresh Token
 */
export const login = async (studentId: string, password: string) => {
  const response = await axios.post(`${API_URL}/login`, { studentId, password });
  if (response.data.accessToken) {
    Cookies.set("accessToken", response.data.accessToken, { secure: true, sameSite: "Strict" });
    Cookies.set("refreshToken", response.data.refreshToken, { secure: true, sameSite: "Strict" });
  }
  return response.data;
};

/**
 * Đăng nhập bằng Google
 */
export const loginWithGoogle = async (idToken: string) => {
  const res = await axios.post(
    `${API_URL}/auth/google`,
    { idToken },
    { withCredentials: true } 
  );
  return res;
};

/**
 * Lấy Access Token mới bằng Refresh Token
 */
export const refreshAccessToken = async () => {
  const refreshToken = Cookies.get("refreshToken");
  if (!refreshToken) return null;

  try {
    const response = await axios.post(`${API_URL}/refresh`, { refreshToken });
    Cookies.set("accessToken", response.data.accessToken, { secure: true, sameSite: "Strict" });
    return response.data.accessToken;
  } catch (error) {
    logout(); 
    return null;
  }
};

/**
 * Lấy thông tin người dùng
 */
export const getUserInfo = async (): Promise<any> => {
  try {
    const res = await axios.get(`${API_URL}/me`, { withCredentials: true });
    return res.data.user;
  } catch (err) {
    console.error("Không thể lấy thông tin người dùng");
    return null;
  }
};

/**
 * Đăng xuất (Xóa token)
 */
export const logout = async () => {
  try {
    const res = await axios.post(
      `${API_URL}/logout`,
      {},
      { withCredentials: true } // để xoá cookie phía server
    );
    return res.data.success;
  } catch (err) {
    console.error("Đăng xuất thất bại:", err);
    return false;
  }
};
