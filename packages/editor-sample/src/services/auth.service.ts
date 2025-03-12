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
export const loginWithGoogle = async (email: string) => {
  const response = await axios.post(`${API_URL}/login-google`, { email });
  if (response.data.accessToken) {
    Cookies.set("accessToken", response.data.accessToken, { secure: true, sameSite: "Strict" });
    Cookies.set("refreshToken", response.data.refreshToken, { secure: true, sameSite: "Strict" });
  }
  return response.data.result;
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
    logout(); // Token không hợp lệ, đăng xuất
    return null;
  }
};

/**
 * Lấy thông tin người dùng
 */
export const getUserInfo = async (): Promise<any> => {
  const accessToken = Cookies.get("accessToken");
  if (!accessToken) return null;

  try {
    const response = await axios.get(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const newToken = await refreshAccessToken();
      if (newToken) return getUserInfo();
    }
    return null;
  }
};

/**
 * Đăng xuất (Xóa token)
 */
export const logout = async () => {
  const refreshToken = Cookies.get("refreshToken");
  if (refreshToken) {
    await axios.post(`${API_URL}/logout`, { refreshToken });
  }
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
};
