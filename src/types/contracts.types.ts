interface IContractDoc {
    contID: string,
    Description: string,
    contName: string,
    contactEmails: string,
    contactPerson: string,
    effectDate: Date,
    expiryDate: Date,
    prjCode: string,
    clID: string,
    created_by: string,
    created_on: Date
}

interface IContract {
    contID: string,
    contName: string,
}

export { IContract, IContractDoc };