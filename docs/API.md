# API Documentation

## Overview

EXPA Mobile communicates with the AIESEC EXPA backend through a GraphQL API. All API requests are authenticated using tokens obtained from Keycloak.

## Base Configuration

- **API Endpoint**: Configured via `VITE_GIS_API` environment variable
- **Authentication**: Bearer token in `Authorization` header
- **Content-Type**: `application/json`
- **Method**: POST (all GraphQL requests)

## GraphQL Helper

### `fetchGraphQL(query, variables)`

**Location**: `src/api/graphql.js`

Core function for all GraphQL operations.

**Parameters**:
- `query` (string): GraphQL query or mutation string
- `variables` (object, optional): Variables for the query/mutation

**Returns**: Promise resolving to the `data` field from the GraphQL response

**Throws**: Error if GraphQL errors are present or network request fails

**Example**:
```javascript
import { fetchGraphQL } from './api/graphql'

const query = `
  query GetApplications($page: Int!) {
    allOpportunityApplication(page: $page) {
      data { id }
    }
  }
`

const data = await fetchGraphQL(query, { page: 1 })
```

## Queries

### Application Index Query

**File**: `src/api/ApplicationIndexQuery_GetTheAllTheApplicationsManageByUser.jsx`

Fetches a paginated list of applications managed by the current user.

**Query**:
```graphql
query ApplicationIndexQuery(
  $page: Int
  $perPage: Int
  $filters: ApplicationFilter
  $sort: String
  $q: String
  $applicant_name: Boolean!
  $opportunity: Boolean!
  $status: Boolean!
  $slot: Boolean!
  $home_mc: Boolean!
  $home_lc: Boolean!
  $phone_number: Boolean!
) {
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
      }
      opportunity {
        id
        title @include(if: $opportunity)
        opportunity_duration_type {
          duration_type
        }
        organisation {
          is_gep
        }
      }
      person {
        id
        full_name @include(if: $applicant_name)
        profile_photo @include(if: $applicant_name)
        email
        contact_detail {
          phone @include(if: $phone_number)
          country_code @include(if: $phone_number)
        }
        home_lc @include(if: $home_lc) {
          name
        }
        home_mc @include(if: $home_mc) {
          name
        }
      }
    }
    paging {
      total_pages
      current_page
      total_items
    }
  }
}
```

**Usage**:
```javascript
import { fetchApplications } from './api/ApplicationIndexQuery_GetTheAllTheApplicationsManageByUser'

const variables = {
  page: 1,
  perPage: 30,
  q: "search query",
  filters: { status: ["open", "matched"] },
  applicant_name: true,
  opportunity: true,
  status: true,
  slot: true,
  home_mc: true,
  home_lc: true,
  phone_number: true
}

const result = await fetchApplications(variables)
// Returns: { data: [...], paging: {...} }
```

**Response Structure**:
```typescript
{
  data: Array<{
    id: string
    status: string
    slot: {
      title: string
      start_date: string
      end_date: string
      applications_close_date: string
      openings: number
    }
    opportunity: {
      id: string
      title: string
      opportunity_duration_type: {
        duration_type: string
      }
      organisation: {
        is_gep: boolean
      }
    }
    person: {
      id: string
      full_name: string
      profile_photo: string
      email: string
      contact_detail: {
        phone: string
        country_code: string
      }
      home_lc: {
        name: string
      }
      home_mc: {
        name: string
      }
    }
  }>
  paging: {
    total_pages: number
    current_page: number
    total_items: number
  }
}
```

### OGX My People Query

**File**: `src/pages/OGXPage.jsx` (inline query)

Fetches people managed by the current user for OGX flow.

**Query**:
```graphql
query MyPeopleIndexQuery($managers: Boolean!) {
  myPeople {
    data {
      id
      full_name
      contact_detail {
        phone
        email
        country_code
      }
      managers @include(if: $managers) {
        full_name
        profile_photo
        email
      }
      is_aiesecer
      cv_url
    }
  }
}
```

**Variables**:
```javascript
{
  managers: true
}
```

**Response Structure**:
```typescript
{
  myPeople: {
    data: Array<{
      id: string
      full_name: string
      contact_detail: {
        phone: string | null
        email: string | null
        country_code: string | null
      }
      managers: Array<{
        full_name: string
        profile_photo: string
        email: string
      }>
      is_aiesecer: boolean
      cv_url: string | null
    }>
  }
}
```

### Current Person Query

**File**: `src/api/CurrentPersonQuery.jsx`

Fetches the current authenticated user's profile.

**Usage**: Check file for query structure.

### Get Application by ID

**File**: `src/api/GetApplicationByID.jsx`

Fetches a single application by its ID.

**Usage**: Check file for query structure.

### Get Application from EP ID

**File**: `src/api/GetApplicationFromEPid.jsx`

Fetches application(s) for a specific Exchange Participant (EP).

**Usage**: Check file for query structure.

## Mutations

### Application Status Mutations

**File**: `src/api/ApplicationMutations.jsx`

All status change operations are handled through the `changeStatusOfApplication` function.

#### Match Application

Matches/accepts an application (changes status to MATCHED).

**Mutation**:
```graphql
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
    }
    status
  }
}
```

**Usage**:
```javascript
import { changeStatusOfApplication } from './api/ApplicationMutations'

await changeStatusOfApplication(applicationId, "ACCEPT")
```

#### Approve Application

Approves an application.

**Mutation**:
```graphql
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
    }
    status
  }
}
```

**Usage**:
```javascript
await changeStatusOfApplication(applicationId, "APPROVE")
await changeStatusOfApplication(applicationId, "APPROVED AS HOST")
await changeStatusOfApplication(applicationId, "APPROVE AS HOME")
```

#### Reject Application

Rejects an application with optional rejection reason.

**Mutation**:
```graphql
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
    }
    status
    rejection_reason {
      id
      name
      type_id
    }
  }
}
```

**Usage**:
```javascript
// Without rejection reason
await changeStatusOfApplication(applicationId, "REJECT")

// With rejection reason
await changeStatusOfApplication(applicationId, "REJECT", rejectionReasonId)
```

**Rejection Reason IDs** (from `statusConfig.jsx`):
- `20851`: Project is canceled
- `20850`: AIESEC is unresponsive
- `20849`: Partner is unresponsive
- `20848`: EP is unresponsive
- `20847`: Problem with the timeline or realization date
- `20846`: Required citizenship not matching
- `20845`: Poor language proficiency
- `20844`: Lack of professional experience
- `20843`: Position is filled
- `20842`: Skills are not suitable
- `20841`: The background is not suitable
- `20840`: Incomplete/low quality of CV/profile

#### Unreject Application

Reopens a rejected application.

**Mutation**:
```graphql
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
    }
    status
  }
}
```

**Usage**:
```javascript
await changeStatusOfApplication(applicationId, "UNREJECT")
```

#### Mark Match as Paid

Marks a matched application as paid (for OGX flow).

**Mutation**:
```graphql
mutation MarkMatchPaidMutation($id: ID!) {
  updateApplication(id: $id, opportunity_application: { paid: true }) {
    id
    status
    permissions {
      can_mark_match_paid
      has_paid_for_match
    }
  }
}
```

**Usage**:
```javascript
await changeStatusOfApplication(applicationId, "PAID FOR APPROVE")
```

### Status Change Function

**Function**: `changeStatusOfApplication(id, newStatus, ...args)`

**Location**: `src/api/ApplicationMutations.jsx`

Main function for changing application status. Automatically selects the appropriate mutation based on the status string.

**Parameters**:
- `id` (string): Application ID
- `newStatus` (string): Target status (see supported statuses below)
- `...args` (optional): Additional arguments (e.g., `rejection_reason_id`)

**Supported Status Values**:
- `"ACCEPT"` → MatchApplicationMutation
- `"APPROVE"` → ApproveApplicationMutation
- `"APPROVED AS HOST"` → ApproveApplicationMutation
- `"APPROVE AS HOME"` → ApproveApplicationMutation
- `"PAID FOR APPROVE"` → MarkMatchPaidMutation
- `"REJECT"` → RejectApplicationMutation (can include rejection_reason_id as 3rd arg)
- `"UNREJECT"` → UnrejectApplicationMutation

**Example**:
```javascript
// Simple status change
await changeStatusOfApplication("123", "ACCEPT")

// Status change with rejection reason
await changeStatusOfApplication("123", "REJECT", 20851)
```

### Update Person

**File**: `src/api/UpdatePerson.jsx`

Updates person information.

**Usage**: Check file for mutation structure.

## Other Operations

### Download CV

**File**: `src/api/DownloadCV.jsx`

Fetches the CV URL for an application.

**Function**: `fetchApplicationCV(applicationId)`

**Returns**: Promise resolving to CV download URL string

**Usage**:
```javascript
import { fetchApplicationCV } from './api/DownloadCV'

const cvUrl = await fetchApplicationCV(applicationId)
// Returns: "https://..."
```

### Manager Search

**File**: `src/api/fetchManagerSearch.jsx`

Searches for managers.

**Usage**: Check file for query structure.

### OGX Queries

**File**: `src/api/ogxQueries.jsx`

Additional OGX-specific queries.

**Usage**: Check file for query structures.

## Error Handling

### GraphQL Errors

GraphQL errors are returned in the response:
```json
{
  "errors": [
    {
      "message": "Error message",
      "locations": [...],
      "path": [...]
    }
  ],
  "data": null
}
```

The `fetchGraphQL` helper:
1. Checks for `errors` in the response
2. Logs errors to console
3. Throws an Error with concatenated error messages

### Network Errors

Network errors (fetch failures) are caught and re-thrown by `fetchGraphQL`.

### Error Handling in Components

Components should handle errors:
```javascript
try {
  const data = await fetchApplications(variables)
  setApplications(data.data)
} catch (err) {
  console.error('Failed to load applications:', err)
  setError('Failed to load applications. Please try again.')
}
```

## Authentication

### Token Retrieval

The API layer automatically retrieves the authentication token from localStorage:

```javascript
const token = localStorage.getItem('aiesec_token')
```

### Token Usage

The token is included in the Authorization header:
```javascript
headers: {
  'Content-Type': 'application/json',
  ...(token ? { Authorization: token } : {}),
}
```

### Token Refresh

Tokens are managed by the Keycloak integration. If a token expires:
1. Keycloak attempts to refresh using the refresh token
2. If refresh fails, user is redirected to login
3. New tokens are stored in localStorage

## Caching

### Service Worker Caching

The service worker caches GraphQL API responses:
- **Strategy**: NetworkFirst
- **Cache Name**: `graphql-cache`
- **Max Entries**: 50
- **Max Age**: 24 hours

### Cache Invalidation

Caches are automatically invalidated after the max age. Manual cache clearing:
- Browser DevTools → Application → Storage → Clear site data
- Or wait for automatic expiration

## Rate Limiting

Currently, no client-side rate limiting is implemented. The backend may implement rate limiting - check backend documentation.

## Best Practices

1. **Always handle errors**: Wrap API calls in try-catch blocks
2. **Show loading states**: Display loading indicators during API calls
3. **Validate responses**: Check for expected data structure before using
4. **Use appropriate queries**: Use conditional fields (`@include`) to fetch only needed data
5. **Handle pagination**: Implement proper pagination for large datasets
6. **Debounce search**: Debounce search queries to reduce API calls
7. **Cache when appropriate**: Let service worker handle caching automatically

## Testing API Calls

### Using Browser DevTools

1. Open DevTools → Network tab
2. Filter by "graphql" or "XHR"
3. Inspect request/response details
4. Check for errors in Console tab

### Using GraphQL Playground

If the backend provides a GraphQL playground:
1. Navigate to the playground URL
2. Authenticate with your token
3. Test queries and mutations
4. Copy working queries to the application

## API Versioning

Currently, no API versioning is implemented. If the backend introduces versioning:
- Update `VITE_GIS_API` to include version path
- Or add version header to requests

## Future Improvements

1. **Request Interceptors**: Add request/response interceptors for logging
2. **Retry Logic**: Implement automatic retry for failed requests
3. **Request Cancellation**: Cancel in-flight requests when component unmounts
4. **Optimistic Updates**: Update UI immediately, rollback on error
5. **Query Caching**: Implement client-side query caching (React Query, Apollo)
6. **Type Safety**: Generate TypeScript types from GraphQL schema

---

For backend API documentation, refer to the EXPA backend documentation.

