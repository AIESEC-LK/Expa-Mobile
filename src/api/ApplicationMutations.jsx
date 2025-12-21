import { fetchGraphQL } from './graphql';

// Define GraphQL mutations for different status changes

const MATCH_APPLICATION_MUTATION = `
  mutation MatchApplicationMutation($id: ID!) {
    matchApplication(id: $id) {
      id
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
      status
      __typename
    }
  }
`;

const APPROVE_APPLICATION_MUTATION = `
  mutation ApproveApplicationMutation($id: ID!) {
    approveApplication(id: $id) {
      id
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
      status
      __typename
    }
  }
`;

const REJECT_APPLICATION_MUTATION = `
  mutation RejectApplicationMutation($id: ID!, $rejection_reason_id: Int) {
    rejectApplication(id: $id, rejection_reason_id: $rejection_reason_id) {
      id
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
      status
      rejection_reason {
        id
        name
        type_id
        __typename
      }
      __typename
    }
  }
`;

const UNREJECT_APPLICATION_MUTATION = `
  mutation UnrejectApplicationMutation($id: ID!) {
    UnrejectApplicationMutation(id: $id) {
      id
      permissions {
        can_be_rejected
        can_be_reopened
        can_be_matched
        can_be_approved_ep
        can_be_approved_tn
        can_be_realized
        can_be_approval_broken
        can_be_realize_broken
        can_be_unrejected
        __typename
      }
      status
      __typename
    }
  }
`;

const MARK_MATCH_PAID_MUTATION = `
  mutation MarkMatchPaidMutation($id: ID!) {
    updateApplication(id: $id, opportunity_application: { paid: true }) {
      id
      status
      permissions {
        can_mark_match_paid
        has_paid_for_match
        __typename
      }
      __typename
    }
  }
`;

// Main function to change the status of the application
export const changeStatusOfApplication = async (id, newStatus, ...args) => {
  //console.log("Changing status for application ID:", id);
  //console.log("New status:", newStatus);

  let mutation;
  let variables = { id };

  if (args.length > 0) {
    variables.rejection_reason_id = args[0];
    //console.log("Additional argument (rejection_reason_id):", args[0]);
  }

  switch (newStatus) {
    case "ACCEPT":
      mutation = MATCH_APPLICATION_MUTATION;
      break;
    case "APPROVE":
      mutation = APPROVE_APPLICATION_MUTATION;
      break;
    case "APPROVED AS HOST":
      mutation = APPROVE_APPLICATION_MUTATION;
      break;
    case "APPROVE AS HOME":
      mutation = APPROVE_APPLICATION_MUTATION;
      break;
    case "PAID FOR APPROVE":
      mutation = MARK_MATCH_PAID_MUTATION;
      break;
    case "REJECT":
      mutation = REJECT_APPLICATION_MUTATION;
      break;
    case "UNREJECT":
      mutation = UNREJECT_APPLICATION_MUTATION;
      //console.log("Preparing to unreject application with ID:", id);
      break;
    default:
      //console.log(`Unknown status: ${newStatus}`);
      return;
  }

  try {
    // send request with the selected mutation and variables
    const result = await fetchGraphQL(mutation, variables);
    //console.log('Status updated:', result);
  } catch (error) {
    console.error("Error updating status:", error);
  }
};
