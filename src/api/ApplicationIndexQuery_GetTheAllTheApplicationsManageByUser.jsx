import { fetchGraphQL } from './graphql';

export const APPLICATION_QUERY_ICX = `
  query ApplicationIndexQuery($page: Int, $perPage: Int, $filters: ApplicationFilter, $sort: String, $q: String, $applicant_name: Boolean!, $opportunity: Boolean!, $status: Boolean!, $slot: Boolean!, $home_mc: Boolean!, $home_lc: Boolean!, $phone_number: Boolean!) {
  allOpportunityApplication(
    page: $page
    per_page: $perPage
    q: $q
    filters: $filters
    sort: $sort
  ) {
    data {
      id
      status @include(if: $status)
      slot @include(if: $slot) {
        title
        start_date
        end_date
        applications_close_date
        openings
        __typename
      }
      opportunity {
        id
        title @include(if: $opportunity)
        opportunity_duration_type {
          duration_type
          __typename
        }
        organisation {
          is_gep
          __typename
        }
        __typename
      }
      person {
        id
        full_name @include(if: $applicant_name)
        profile_photo @include(if: $applicant_name)
        email
        contact_detail {
          phone @include(if: $phone_number)
          country_code @include(if: $phone_number)
          __typename
        }
        home_lc @include(if: $home_lc) {
          name
          __typename
        }
        home_mc @include(if: $home_mc) {
          name
          __typename
        }
        __typename
      }
      __typename
    }
    paging {
      total_pages
      current_page
      total_items
      __typename
    }
  }
}
`;

export const APPLICATION_QUERY_OGX = `
  query ApplicationIndexQuery($page: Int, $perPage: Int, $filters: ApplicationFilter, $sort: String, $q: String, $applicant_name: Boolean!, $opportunity: Boolean!, $status: Boolean!, $slot: Boolean!, $home_mc: Boolean!, $home_lc: Boolean!, $phone_number: Boolean!) {
  allOpportunityApplication(
    page: $page
    per_page: $perPage
    q: $q
    filters: $filters
    sort: $sort
  ) {
    data {
      id
      status @include(if: $status)
      slot @include(if: $slot) {
        title
        start_date
        end_date
        applications_close_date
        openings
        __typename
      }
      opportunity {
        id
        title @include(if: $opportunity)
        opportunity_duration_type {
          duration_type
          __typename
        }
        organisation {
          is_gep
          __typename
        }
        __typename
      }
      person {
        id
        full_name @include(if: $applicant_name)
        profile_photo @include(if: $applicant_name)
        email
        contact_detail {
          phone @include(if: $phone_number)
          country_code @include(if: $phone_number)
          __typename
        }
        host_lc @include(if: $host_lc) {
          name
          __typename
        }
        host_mc @include(if: $host_mc) {
          name
          __typename
        }
        __typename
      }
      __typename
    }
    paging {
      total_pages
      current_page
      total_items
      __typename
    }
  }
}
`;

/**
 * Fetch applications using the shared GraphQL helper.
 * Returns the `allOpportunityApplication` payload (or null if not present).
 * @param APPLICATION_QUERY
 * @param {Object} variables - Variables for the APPLICATION_QUERY
 */
export const fetchApplications = async (APPLICATION_QUERY, variables) => {
  const data = await fetchGraphQL(APPLICATION_QUERY, variables);
  return data?.allOpportunityApplication ?? null;
};
