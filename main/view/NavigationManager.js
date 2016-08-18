module.exports = class NavigationManager {

    constructor(entityType, getRouter) {
        this.rootPath = entityType.name.toLowerCase()
        this.getRouter = getRouter
    }

    get mainPath() { return "/" + this.rootPath }
    get newPath() { return "/" + this.rootPath + "/new" }
    get selectedPath() { return "/" + this.rootPath + "/:selectedId" }

    pathTo(entityOrId) {
        const id = entityOrId.id ? entityOrId.id : entityOrId
        return "/" + this.rootPath + "/" + id
    }

    navigate(id) {
        this.getRouter().navigate(id ? this.pathTo(id) : this.mainPath)
    }

    navigateNew() {
        this.getRouter().navigate(this.pathTo("new"))
    }
}