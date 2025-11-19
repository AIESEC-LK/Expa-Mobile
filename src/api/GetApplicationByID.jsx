import { fetchGraphQL } from './graphql';

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
        const data = await fetchGraphQL(GET_APPLICATION_QUERY, { id: applicationId });
        return data?.getApplication ?? null;
     } catch (error) {
         console.error("Error fetching data:", error);
         throw error;
     }
 };
