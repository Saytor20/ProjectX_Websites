import fs from 'fs/promises'
import path from 'path'

export interface RestaurantListItem {
	id: string
	name: string
}

export async function listRestaurants(): Promise<RestaurantListItem[]> {
	const dataDir = path.join(process.cwd(), 'data/restaurants')
	let files: string[] = []
	try {
		files = await fs.readdir(dataDir)
	} catch {
		return []
	}
	const jsonFiles = files.filter(f => f.endsWith('.json') && !f.startsWith('_'))
	const items: RestaurantListItem[] = []
	for (const file of jsonFiles) {
		try {
			const raw = await fs.readFile(path.join(dataDir, file), 'utf8')
			const json = JSON.parse(raw)
			const name = json?.restaurant_info?.name || file.replace('.json', '').replace(/_/g, ' ')
			items.push({ id: file.replace('.json', ''), name })
		} catch {
			const id = file.replace('.json', '')
			items.push({ id, name: id })
		}
	}
	return items.sort((a, b) => a.name.localeCompare(b.name))
}

export async function getRestaurant(slug: string): Promise<any | null> {
	try {
		const filePath = path.join(process.cwd(), 'data/restaurants', `${slug}.json`)
		const raw = await fs.readFile(filePath, 'utf8')
		return JSON.parse(raw)
	} catch {
		return null
	}
}


