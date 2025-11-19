// src/api/graphql.js
import { fetchGraphQL } from './graphql';

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
        // Use shared fetchGraphQL to execute the mutation
        const data = await fetchGraphQL(UPDATE_PERSON_MUTATION, {
            id,
            person: { manager_ids: managerIds },
        });

        return data?.updatePerson ?? null;
    } catch (error) {
        console.error("Error updating person:", error);
        throw error;
    }
};
