// src/api/graphql.js

const GRAPHQL_API_URL = import.meta.env.VITE_GIS_API;
const AUTH_TOKEN = import.meta.env.VITE_TOKEN;

export const MATCH_APPLICATION_MUTATION = `
  mutation MatchApplicationMutation($id: ID!) {
    matchApplication(id: $id) {
      id
      status
      permissions {
        can_be_rejected
        can_be_matched
        can_be_approved_ep
        can_be_approved_tn
        can_be_realized
        can_be_approval_broken
        can_be_realize_broken
        __typename
      }
      __typename
    }
  }
`;

const fetchMatchApplication = async (id) => {
    try {
        const response = await fetch(GRAPHQL_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": AUTH_TOKEN,
            },
            body: JSON.stringify({
                query: MATCH_APPLICATION_MUTATION,
                variables: { id },
            }),
        });

        const data = await response.json();
        if (data.errors) {
            console.error("GraphQL errors:", data.errors);
            throw new Error("Failed to fetch match application result");
        }

        return data.data.matchApplication;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
};

export const changeStatusOfApplication = async (id, newStatus) => {
    try {
        switch (newStatus) {
            case 'ACCEPTED':
                await fetchMatchApplication(id);
                break;
            default:
                console.log(`Unknown status: ${newStatus}`);
        }
    } catch (error) {
        console.error('Error updating status:', error);
    }
};

