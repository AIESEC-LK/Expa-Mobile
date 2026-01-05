// Lightweight GraphQL helper for the project
// Exports a single function `fetchGraphQL(query, variables)` which
// performs the network request and returns the `data` field from the
// GraphQL response (or throws if there are errors).

const GRAPHQL_API_URL = import.meta.env.VITE_GIS_API;

/**
 * Execute a GraphQL query against the configured API and return the data payload.
 * @param {string} query - GraphQL query string
 * @param {Object} [variables={}] - Variables object for the query
 * @returns {Promise<Object>} - The `data` object from the GraphQL response
 * @throws {Error} - When network error or GraphQL errors are returned
 */
export async function fetchGraphQL(query, variables = {}) {
    const token = localStorage.getItem('aiesec_token');

    const response = await fetch(GRAPHQL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: token } : {}),
      },
      body: JSON.stringify({ query, variables }),
    });

    const json = await response.json();

    if (json.errors) {
      console.error('GraphQL errors:', json.errors);
      const message = json.errors.map((e) => e.message || JSON.stringify(e)).join('; ');
      throw new Error(message || 'GraphQL returned errors');
    }

    return json.data;
}
