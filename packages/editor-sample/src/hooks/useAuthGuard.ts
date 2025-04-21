import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserInfo } from "../services/auth.service";

export const useAuthGuard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const user = await getUserInfo();
      if (!user) navigate("/login");
    })();
  }, []);
};
