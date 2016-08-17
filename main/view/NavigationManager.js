module.exports = class NavigationManager {

    constructor(entityType, routerFn) {
        this.rootPath = entityType.name.toLowerCase()
        this.routerFn = routerFn
    }

    get listPath() { return "/" + this.rootPath }
    get newPath() { return "/" + this.rootPath + "/new" }
    get selectedPath() { return "/" + this.rootPath + "/:selectedId" }

    pathTo(entityOrId) {
        const id = entityOrId.id ? entityOrId.id : entityOrId
        return "/" + this.rootPath + "/" + id
    }

    navigate(id) {
        this.routerFn().navigate(this.pathTo(id))
    }

    navigateNew() {
        this.routerFn().navigate(this.pathTo("new"))
    }
}