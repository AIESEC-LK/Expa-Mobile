// Import necessary React hooks
import { useState, useEffect } from 'react';

// GraphQL query for fetching people data with managers
export const myPeopleIndexQuery = `
  query MyPeopleIndexQuery($page: Int, $perPage: Int, $managers: Boolean!) {
    myPeople(page: $page, per_page: $perPage) {
      data {
        id
        full_name
        profile_photo
        status
        created_at
        gender
        managed_opportunities {
          edges {
            node {
              id
              title
              status
              programmes {
                short_name_display
              }
            }
          }
        }
        managers @include(if: $managers) {
          full_name
          profile_photo
          id
          email
        }
      }
    }
  }
`;

// Function to fetch data from GraphQL API
export async function fetchPeopleData(params) {
  const GRAPHQL_API_URL = import.meta.env.VITE_GIS_API;
  const AUTH_TOKEN = localStorage.getItem("aiesec_token");

  const { page, perPage, managers } = params;

  try {
    const response = await fetch(GRAPHQL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': AUTH_TOKEN,
      },
      body: JSON.stringify({
        query: myPeopleIndexQuery,
        variables: { page, perPage, managers }
      }),
    });

    const result = await response.json();
    return result.data.myPeople.data;
  } catch (error) {
    console.error("Error fetching people data:", error);
    return [];
  }
}

// Custom React hook to fetch data
export function usePeopleData(params) {
  const [peopleData, setPeopleData] = useState(null);

  useEffect(() => {
    fetchPeopleData(params).then(setPeopleData);
  }, [params]);

  return peopleData;
}
