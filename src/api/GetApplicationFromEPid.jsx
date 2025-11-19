import { fetchGraphQL } from './graphql';

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
        const data = await fetchGraphQL(PERSON_APPLICATIONS_QUERY, {
            id,
            filters: {
                statuses: [
                    "approved",
                    "open",
                    "accepted",
                    "matched",
                    "approved_tn_manager",
                    "approved_ep_manager",
                ],
            },
        });

        return data?.personApplications?.data ?? [];
     } catch (error) {
         console.error("Error fetching data:", error);
         throw error;
     }
 };
