import  { useEffect } from "react";
import Cookies from "js-cookie";

// eslint-disable-next-line react/prop-types
const AuthWrapper = ({ children }) => {

    const extractAndStoreTokens = () => {
        const params = new URLSearchParams(window.location.search);
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");
    
        if (accessToken) {
          Cookies.set("access_token", accessToken, { expires: 1, secure: true, sameSite: "Strict" });
          console.log("Access token stored.");
        }
    
        if (refreshToken) {
          Cookies.set("refresh_token", refreshToken, { expires: 7, secure: true, sameSite: "Strict" });
          console.log("Refresh token stored.");
        }
    
        // Clean the URL by removing the token parameters
        if (accessToken || refreshToken) {
          const urlWithoutParams = window.location.origin + window.location.pathname;
          window.history.replaceState({}, document.title, urlWithoutParams);
          console.log("URL cleaned of token parameters.");
        }
      };

  const validateToken = async () => {
    const accessToken = Cookies.get("access_token");
    const refreshToken = Cookies.get("refresh_token");

    if (!accessToken && refreshToken) {
      console.log("No access token. Attempting refresh...");
      const success = await refreshAccessToken(refreshToken);
      if (!success) {
        console.log("Token refresh failed. Redirecting to login.");
        redirectToLogin();
        return false;
      }
    } else if (!accessToken) {
      console.log("No tokens available. Redirecting to login.");
      redirectToLogin();
      return false;
    }

    return true;
  };

  const redirectToLogin = async () => {
    try {
      const response = await fetch("/api", {
        method: "GET",
        headers: {
          "X-Callback-Url": "http://localhost:3001",
          "X-Requested-With": "fetch",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.redirectUrl) {
          window.location.href = data.redirectUrl; 
        }
      } else {
        console.error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error during login redirection:", error);
    }
  };

  const refreshAccessToken = async (refreshToken) => {
    try {
      const response = await fetch("/api", {
        method: "GET",
        headers: {
            "X-Callback-Url": "http://localhost:3001",
          "Refresh-Token": refreshToken,
          "X-Requested-With": "fetch",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.accessToken) {
            Cookies.set("access_token", data.accessToken, { expires: 1, secure: true, sameSite: "Strict" });
            console.log("Access token refreshed.");
            return true;
        }
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
    }
    return false;
  };



  useEffect(() => {
    extractAndStoreTokens();
    validateToken();
  }, []);

  return <>{children}</>;
};

export default AuthWrapper;
