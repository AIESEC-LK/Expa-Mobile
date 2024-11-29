// src/api/graphql.js

const GRAPHQL_API_URL = import.meta.env.VITE_GIS_API;
const AUTH_TOKEN = import.meta.env.VITE_TOKEN;

export const MANAGER_SEARCH_QUERY = `
  query AutoCompleteDropdownQuery($q: String) {
    peopleAutocompleteColleagues(q: $q) {
      full_name
      id
      profile_photo
      __typename
    }
  }
`;

export const fetchManagerSearch = async (q) => {
    try {
        const response = await fetch(GRAPHQL_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": AUTH_TOKEN,
            },
            body: JSON.stringify({
                query: MANAGER_SEARCH_QUERY,
                variables: { q },
            }),
        });

        const data = await response.json();
        if (data.errors) {
            console.error("GraphQL errors:", data.errors);
            throw new Error("Failed to fetch manager search results");
        }

        return data.data.peopleAutocompleteColleagues;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
};
