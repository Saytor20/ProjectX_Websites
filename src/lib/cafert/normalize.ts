export interface CafertMenuItem {
	title: string
	description?: string
	price?: number
	image?: string
}

export interface CafertData {
	brand: {
		name: string
		logo?: string
		address?: string
		phones?: string[]
		email?: string
	}
	hero: {
		title: string
		subtitle?: string
		slides: string[]
	}
	offer: {
		headline: string
		sub: string
		cta?: string
	}
	menuTabs: { label: string; items: CafertMenuItem[] }[]
	presentation: { images: string[] }
	testimonials: { quote: string; author: string }[]
	recentPosts: { title: string; date: string; excerpt: string }[]
	video?: { youtubeId?: string }
	location?: { lat?: number; lng?: number }
}

export function normalizeRestaurant(json: any): CafertData {
	const info = json?.restaurant_info || {}
	const cats = json?.menu_categories || {}

	const slides: string[] = []
	// Attempt to collect some images from categories as hero slides
	for (const arr of Object.values(cats) as any[]) {
		if (Array.isArray(arr)) {
			for (const it of arr) {
				if (it?.image && slides.length < 6) slides.push(it.image)
			}
		}
		if (slides.length >= 6) break
	}
	if (slides.length === 0) slides.push('/cafert/img/placeholder.jpg')

	const tabs = pickMenuTabs(cats)

	return {
		brand: {
			name: info?.name || 'Cafert',
			logo: '/cafert/svg/logo.svg',
			address: [info?.region, info?.state, info?.country].filter(Boolean).join(', '),
			phones: info?.phone ? [String(info.phone)] : undefined,
			email: undefined
		},
		hero: {
			title: info?.name || 'Welcome to Cafert',
			subtitle: info?.type_of_food ? `Authentic ${info.type_of_food}` : undefined,
			slides
		},
		offer: {
			headline: 'Free Breakfast!',
			sub: 'Every 5th breakfast as a gift.',
			cta: 'Reservations'
		},
		menuTabs: tabs,
		presentation: { images: slides.slice(0, 6) },
		testimonials: [
			{ quote: 'Amazing taste and cozy atmosphere.', author: 'Kristin Watson' },
			{ quote: 'Top desserts worth trying!', author: 'Derek Smith' }
		],
		recentPosts: [
			{ title: 'Secrets of Delicious Coffee', date: '26 Mar, 2022', excerpt: 'Gravida arcu, tempus sapien enim posuere auctor.' },
			{ title: 'Top 5 Desserts Worth Trying', date: '26 Mar, 2022', excerpt: 'Cursus bibendum a dictumst nam ultrices.' }
		],
		video: undefined,
		location: {
			lat: info?.coordinates?.latitude,
			lng: info?.coordinates?.longitude
		}
	}
}

function pickMenuTabs(cats: Record<string, any>): { label: string; items: CafertMenuItem[] }[] {
	const preferred = ['Beverages', 'Starters', 'Breakfasts', 'Desserts']
	const entries = Object.entries(cats) as [string, any[]][]
	// Build map with normalized items
	const mapped = entries.map(([key, arr]) => {
		const items: CafertMenuItem[] = Array.isArray(arr)
			? (arr as any[]).slice(0, 8).map((it) => ({
				title: it?.item_en || it?.item_ar || it?.name || 'Dish',
				description: it?.description,
				price: typeof it?.price === 'number' ? it.price : Number(it?.price) || undefined,
				image: it?.image
			}))
			: []
		return { label: capitalize(key), items }
	})

	// Prefer template tab order when available
	const result: { label: string; items: CafertMenuItem[] }[] = []
	for (const label of preferred) {
		const found = mapped.find(m => m.label.toLowerCase() === label.toLowerCase())
		if (found && found.items.length) result.push(found)
	}
	// Fill remaining up to 4
	for (const m of mapped) {
		if (result.length >= 4) break
		if (!result.find(r => r.label.toLowerCase() === m.label.toLowerCase()) && m.items.length) {
			result.push(m)
		}
	}
	return result.slice(0, 4)
}

function capitalize(s: string) {
	return (s || '').charAt(0).toUpperCase() + (s || '').slice(1)
}


