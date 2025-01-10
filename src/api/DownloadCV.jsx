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
        const response = await fetch(GRAPHQL_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": AUTH_TOKEN,
            },
            body: JSON.stringify({
                query,
                variables,
            }),
        });

        const result = await response.json();

        // Return the CV URL if available
        return result.data.getApplication.person.cv_url;
    } catch (error) {
        console.error("Failed to fetch CV URL", error);
        return null;
    }
}
