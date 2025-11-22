const baseUrl = process.env.NEXT_PUBLIC_BASE_URL


export const endpoints = (params, query) => {
    const Matches = {
        get_matches: `${baseUrl}/matches`,
        post_matches: `${baseUrl}/matches/generate`,
        get_matched_user: `${baseUrl}/matches/${params}`,
        browse_matched_users: `${baseUrl}/matches/browse`,
        aceept_reject_matched_user: `${baseUrl}/matches/${query}/status`,
    }
     const Profiles = {
        profiles: `${baseUrl}/profiles`,
        my_profile: `${baseUrl}/profiles/me`,
        user_profile: `${baseUrl}/profiles/${params}`,
    }

    return {Matches, Profiles}
}