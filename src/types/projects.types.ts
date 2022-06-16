interface IProjectDoc {
    clientID: string,
    prjID: string,
    prjDescription: string,
    prjName: string
}

interface IProject {
    prjID: string,
    prjName: string
}

export { IProject, IProjectDoc };
