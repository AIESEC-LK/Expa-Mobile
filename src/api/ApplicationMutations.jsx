// src/api/graphql.js

const GRAPHQL_API_URL = import.meta.env.VITE_GIS_API;
const AUTH_TOKEN = import.meta.env.VITE_TOKEN;

// Define GraphQL mutations for different status changes

const MATCH_APPLICATION_MUTATION = `
  mutation MatchApplicationMutation($id: ID!) {
    matchApplication(id: $id) {
      id
    }
  }
`;

const APPROVE_APPLICATION_MUTATION = `
  mutation ApproveApplicationMutation($id: ID!) {
    approveApplication(id: $id) {
      id
    }
  }
`;

const REJECT_APPLICATION_MUTATION = `
  mutation RejectApplicationMutation($id: ID!) {
    rejectApplication(id: $id) {
      id
    }
  }
`;

const sendGraphQLRequest = async (mutation, variables) => {
  try {
    const response = await fetch(GRAPHQL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: AUTH_TOKEN,
      },
      body: JSON.stringify({
        query: mutation,
        variables: variables,
      }),
    });

    const data = await response.json();
    if (data.errors) {
      console.error("GraphQL errors:", data.errors);
      throw new Error("Failed to execute GraphQL mutation");
    }

    return data.data;
  } catch (error) {
    console.error("Error in GraphQL request:", error);
    throw error;
  }
};

// Main function to change the status of the application
export const changeStatusOfApplication = async (id, newStatus) => {
  let mutation;
  let variables = { id };

  switch (newStatus) {
    case "ACCEPTED":
      mutation = MATCH_APPLICATION_MUTATION;
      break;
    case "APPROVED":
      mutation = APPROVE_APPLICATION_MUTATION;
      break;
    case "REJECTED":
      mutation = REJECT_APPLICATION_MUTATION;
      break;
    // Add more cases as necessary
    default:
      console.log(`Unknown status: ${newStatus}`);
      return;
  }

  try {
    // send request with the selected mutation and variables
    const result = await sendGraphQLRequest(mutation, variables);
    console.log("Status updated:", result);
  } catch (error) {
    console.error("Error updating status:", error);
  }
};
