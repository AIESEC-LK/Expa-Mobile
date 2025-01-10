const GRAPHQL_API_URL = import.meta.env.VITE_GIS_API;
const AUTH_TOKEN = import.meta.env.VITE_TOKEN;

export const GET_APPLICATION_QUERY = `
  query GetApplication($id: ID!) {
    getApplication(id: $id) {
      cv {
        url
      }
      home_mc {
        full_name
      }
      host_lc {
        full_name
      }
      slot {
        title
        end_date
        start_date
      }
      status
    }
  }
`;

export const fetchApplicationByApplicationID = async (applicationId) => {
    try {
        const response = await fetch(GRAPHQL_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": AUTH_TOKEN,
            },
            body: JSON.stringify({
                query: GET_APPLICATION_QUERY,
                variables: { id: applicationId },
            }),
        });

        const data = await response.json();
        if (data.errors) {
            console.error("GraphQL errors:", data.errors);
            throw new Error("Failed to fetch application data");
        }

        return data.data.getApplication;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
};
