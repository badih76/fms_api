interface IClientDoc {
    clID: string,
    SitesCount: number,
    clAddress: string,
    clContactName: string,
    clContactNumber: string,
    clEmail: string,
    clName: string
}

interface IClient {
    clID: string,
    clName: string
}

export {IClientDoc, IClient};