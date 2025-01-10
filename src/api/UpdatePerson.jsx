// src/api/graphql.js

const GRAPHQL_API_URL = import.meta.env.VITE_GIS_API;
const AUTH_TOKEN = localStorage.getItem("aiesec_token");

// The GraphQL mutation for updating a person
export const UPDATE_PERSON_MUTATION = `
  mutation UpdatePersonMutation($id: ID!, $person: PersonInput) {
    updatePerson(id: $id, person: $person) {
      expa_settings {
        email_notifications
        __typename
      }
      managers {
        id
        full_name
        profile_photo
        __typename
      }
      contacted_at
      contacted_by {
        full_name
        __typename
      }
      follow_up {
        id
        name
        __typename
      }
      person_profile {
        selected_programmes
        __typename
      }
      __typename
    }
  }
`;

// Function to update person details with the manager assignment
export const updatePersonMutation = async (id, managerIds) => {
    try {
        const response = await fetch(GRAPHQL_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": AUTH_TOKEN,
            },
            body: JSON.stringify({
                query: UPDATE_PERSON_MUTATION,
                variables: {
                    id,
                    person: {
                        manager_ids: managerIds,
                    },
                },
            }),
        });

        const data = await response.json();
        if (data.errors) {
            console.error("GraphQL errors:", data.errors);
            throw new Error("Failed to update person");
        }

        return data.data.updatePerson;
    } catch (error) {
        console.error("Error updating person:", error);
        throw error;
    }
};
