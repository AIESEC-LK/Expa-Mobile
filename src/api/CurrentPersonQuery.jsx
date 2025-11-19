// Import necessary React and environment configuration
import { useState, useEffect } from 'react';
import { fetchGraphQL } from './graphql';

let cachedPersonData = null; // Cache to store the response globally

export async function fetchCurrentPersonData() {
    if (cachedPersonData) return cachedPersonData; // Return cached data if it exists

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
        const data = await fetchGraphQL(query);
        if (data?.currentPerson) {
            cachedPersonData = data.currentPerson; // Cache the data globally
            return cachedPersonData;
        } else {
            throw new Error('No data found in response');
        }
    } catch (error) {
        console.error("Failed to fetch current person data:", error);
        return null;
    }
}

// Custom React hook to handle fetching and returning the cached data
export function useCurrentPersonData() {
    const [personData, setPersonData] = useState(cachedPersonData);
    useEffect(() => {
        if (!cachedPersonData) {
            fetchCurrentPersonData().then(setPersonData);
        }
    }, []);

    return personData;
}