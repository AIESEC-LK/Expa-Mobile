import React from "react";

function Auth() {
    const expaLogin = async () => {
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
                    window.location.href = data.redirectUrl; // Redirect the user explicitly
                }
            } else {
                console.error(`HTTP error! Status: ${response.status}`);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const refreshToken = async () => {
        try {
            const response = await fetch("/api", {
                method: "GET",
                headers: {
                    "X-Callback-Url": "http://localhost:3001",
                    "Refresh-Token": "YvHtZoVavKwM1Du7_vJFd5bo0Vlb98aGSE1zN_oqE6Q",
                    "X-Requested-With": "fetch",
                },
            });

            if (response.ok) {
                const data = await response.json();
                if (data.redirectUrl) {
                    window.location.href = data.redirectUrl; // Redirect the user explicitly
                }
            } else {
                console.error(`HTTP error! Status: ${response.status}`);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    return (
        <div>
            <button
                onClick={expaLogin}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none"
            >
                Expa Login
            </button>
            <button
                onClick={refreshToken}
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 focus:outline-none ml-4"
            >
                Refresh Token
            </button>
        </div>
    );
}

export default Auth;
