import { fetchGraphQL } from './graphql';

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
        const data = await fetchGraphQL(MANAGER_SEARCH_QUERY, { q });
        return data?.peopleAutocompleteColleagues ?? [];
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
};
