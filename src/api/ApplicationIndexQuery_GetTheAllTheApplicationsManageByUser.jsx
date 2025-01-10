// src/api/graphql.js

const GRAPHQL_API_URL = import.meta.env.VITE_GIS_API;
const AUTH_TOKEN = localStorage.getItem("aiesec_token");

export const APPLICATION_QUERY = `
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

export const fetchApplications = async (variables) => {
    try {
        const response = await fetch(GRAPHQL_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": AUTH_TOKEN,
            },
            body: JSON.stringify({
                query: APPLICATION_QUERY,
                variables,
            }),
        });

        const data = await response.json();
        if (data.errors) {
            console.error("GraphQL errors:", data.errors);
            throw new Error("Failed to fetch applications");
        }

        return data.data.allOpportunityApplication;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
};
