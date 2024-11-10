const applicationFetchConfig = (page, perPage) => ({
    page,
    perPage,
    filters: { my: "opportunity" },
    q: "",
    applicant_name: true,
    email: true,
    opportunity: true,
    status: true,
    slot: true,
    home_mc: true,
    home_lc: true,
    phone_number: true,
    sort: ""
});

export default applicationFetchConfig;
