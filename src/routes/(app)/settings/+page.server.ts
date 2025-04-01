import { findUserAPIKeys } from '$lib/services/cms/apiauth';
import { getUserEmail } from '$lib/services/cms/helpers';

export async function load({ locals }) {
    const user = await getUserEmail(locals)
    const keys = await findUserAPIKeys(user)

    return {
        keys
    };
}

