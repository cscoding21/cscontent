import { prisma } from '$lib/services/prisma'


export async function load() {
    const users = await prisma.account.findMany()

	return {
		users
	};
}
