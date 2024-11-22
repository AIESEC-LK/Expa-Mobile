// Import necessary React and environment configuration
import { useState, useEffect } from 'react';

let cachedPersonData = null; // Cache to store the response globally

export async function fetchCurrentPersonData() {
    if (cachedPersonData) return cachedPersonData; // Return cached data if it exists

    const GRAPHQL_API_URL = import.meta.env.VITE_GIS_API;
    const AUTH_TOKEN = import.meta.env.VITE_TOKEN;

    const query = `
        query CurrentPersonQuery {
            currentPerson {
                id
                full_name
                profile_photo
            }
        }
    `;

    try {
        const response = await fetch(GRAPHQL_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': AUTH_TOKEN,
            },
            body: JSON.stringify({ query }),
        });

        const result = await response.json();
        console.log(result)
        if (result?.data?.currentPerson) {
            cachedPersonData = result.data.currentPerson; // Cache the data globally
            return cachedPersonData;
        } else {
            throw new Error("No data found in response");
        }
    } catch (error) {
        console.error("Failed to fetch current person data:", error);
        return null;
    }
}

// Custom React hook to handle fetching and returning the cached data
export function useCurrentPersonData() {
    const [personData, setPersonData] = useState(cachedPersonData);
    console.log("Hello");
    useEffect(() => {
        console.log("Hello2");
        if (!cachedPersonData) {
            fetchCurrentPersonData().then(setPersonData);
        }
    }, []);

    return personData;
}