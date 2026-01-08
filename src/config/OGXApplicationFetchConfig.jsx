const OGXApplicationFetchConfig = (page, perPage, q = "", statuses = []) => ({
    page,
    perPage,
    filters: {
        for: "people",
        ...(statuses.length > 0 ? { statuses } : {})  // Only add statuses if it's not empty
    },
    q,
    applicant_name: true,
    email: true,
    opportunity: true,
    status: true,
    slot: true,
    host_mc: true,
    host_lc: true,
    phone_number: true,
    sort: ""
});

export default OGXApplicationFetchConfig;
