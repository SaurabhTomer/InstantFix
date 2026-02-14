import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "../store/userSlice.js";

const serverUrl = "http://localhost:3000/api";

export const useFetchUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const fetchUser = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${serverUrl}/user/getme`, { withCredentials: true });
      const userData = res.data?.user || null;
      dispatch(setUserData(userData));
      return userData;
    } catch (err) {
      const errorMessage = err?.response?.data?.message || err?.response?.data?.msg || "Failed to load user";
      setError(errorMessage);
      dispatch(setUserData(null));
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return { loading, error, refetch: fetchUser };
};
