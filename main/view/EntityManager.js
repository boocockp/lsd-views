module.exports = class EntityManager {
    get(id) { throw new Error("Must override")}
    choiceList() { throw new Error("Must override")}
    newInstance() { throw new Error("Must override")}
    save(entity) { throw new Error("Must override")}
    linkHref(entity) { throw new Error("Must override")}
}