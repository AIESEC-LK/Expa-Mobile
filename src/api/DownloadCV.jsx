import { fetchGraphQL } from './graphql';

// Function to fetch the CV URL for a given application ID
export async function fetchApplicationCV(id) {
    const GRAPHQL_API_URL = import.meta.env.VITE_GIS_API;
    const AUTH_TOKEN = localStorage.getItem("aiesec_token");

    const query = `
        query ApplicationHomeQuery($id: ID!) {
            getApplication(id: $id) {
                person {
                    cv_url
                }
            }
        }
    `;

    const variables = {
        id,
    };

    try {
        const data = await fetchGraphQL(query, variables);
        // Return the CV URL if available
        return data?.getApplication?.person?.cv_url ?? null;
    } catch (error) {
        console.error("Failed to fetch CV URL", error);
        return null;
    }
}
