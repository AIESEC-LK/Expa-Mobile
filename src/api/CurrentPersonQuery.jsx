// Function to fetch the CV URL for a given application ID
export async function CurrentPersonQuery(id) {
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
                "Authorization": AUTH_TOKEN,
            },
            body: JSON.stringify({
                query,
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
