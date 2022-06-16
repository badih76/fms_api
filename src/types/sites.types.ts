interface ISiteDoc {
    siteID: string,
	siteTitle: string,
	siteDescription: string,
	siteLocation: string,
	siteRemarks: string,
	siteCategory: string
}

interface ISite {
    siteID: string,
	siteTitle: string,
}

export { ISite, ISiteDoc };