const baseUrl = process.env.NEXT_PUBLIC_BASE_URL


export const endpoints = (params, query) => {
    const Matches = {
        get_matches: `${baseUrl}/matches`,
        post_matches: `${baseUrl}/matches/generate`,
        get_matched_user: `${baseUrl}/matches/${params}`,
        browse_matched_users: `${baseUrl}/matches/browse`,
        aceept_reject_matched_user: `${baseUrl}/matches/${query}/status`,
    }

    return {Matches}
}