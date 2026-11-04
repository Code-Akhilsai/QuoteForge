import { useReducer, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return { ...state, user: action.payload.user, token: action.payload.token, isAuthenticated: true, isLoading: false };
    case "LOGOUT":
      return { ...initialState, isLoading: false };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const stored = localStorage.getItem("qf_auth");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        dispatch({ type: "LOGIN_SUCCESS", payload: parsed });
      } catch {
        localStorage.removeItem("qf_auth");
        dispatch({ type: "LOGOUT" });
      }
    } else {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const login = (user, token) => {
    const payload = { user, token };
    localStorage.setItem("qf_auth", JSON.stringify(payload));
    dispatch({ type: "LOGIN_SUCCESS", payload });
  };

  const logout = () => {
    localStorage.removeItem("qf_auth");
    dispatch({ type: "LOGOUT" });
  };

  const hasRole = (...roles) => {
    if (!state.user) return false;
    return roles.includes(state.user.role);
  };

  const value = {
    ...state,
    login,
    logout,
    hasRole,
    isRole: (role) => state.user?.role === role,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
