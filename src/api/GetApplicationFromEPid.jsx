const GRAPHQL_API_URL = import.meta.env.VITE_GIS_API;
const AUTH_TOKEN = localStorage.getItem("aiesec_token");

export const PERSON_APPLICATIONS_QUERY = `
  query ActiveApplicationsQuery($id: ID!) {
    personApplications(id: $id) {
        data {
            id
            opportunity {
                id
                title
                programme {
                    short_name_display
                    __typename
                }
                home_mc {
                    country
                }
                __typename
            }
            __typename
        }
        __typename
    }
}
`;

export const fetchPersonApplicationsFromEPid = async (id) => {
    try {
        const response = await fetch(GRAPHQL_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": AUTH_TOKEN,
            },
            body: JSON.stringify({
                query: PERSON_APPLICATIONS_QUERY,
                variables: {
                    id,
                    filters: {
                        statuses: [
                            "approved",
                            "open",
                            "accepted",
                            "matched",
                            "approved_tn_manager",
                            "approved_ep_manager"
                        ]
                    },
                }
            }),
        });

        const data = await response.json();

        if (data.errors) {
            console.error("GraphQL errors:", data.errors);
            throw new Error("Failed to fetch person applications");
        }

        return data.data.personApplications.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
};
