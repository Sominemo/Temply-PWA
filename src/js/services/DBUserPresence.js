import FieldsContainer from "../tools/validation/fieldsContainer"
import FieldChecker from "../tools/validation/fieldChecker"
import { SettingsSectionElement, SettingsGroupContainer } from "../ui/DOM/Library/settings"
import { CardList } from "../ui/DOM/Library/object/card"
import IconSide from "../ui/DOM/Library/object/iconSide"
import DOM from "../ui/DOM/Classes/dom"
import { Button } from "../ui/DOM/Library/object/input"
import fileSizeForHuman from "../tools/transformation/text/fileSizeForHuman"
import { $$, $ } from "./Language/handler"

export default class DBUserPresence {
    static _register = []

    static registerNewPresence(data) {
        new FieldsContainer([
            ["id", "name", "description", "config", "actions", "functions"],
            {
                id: new FieldChecker({ type: "string", symbols: "a-zA-Z_" }),
                name: new FieldChecker({ tyle: "string" }),
                description: new FieldChecker({ type: "string" }),
                icon: new FieldChecker({ type: "string", symbold: "a-z_" }),
                quota: new FieldChecker({ type: "function" }),
                size: new FieldChecker({ type: "function" }),
                config: new FieldsContainer([
                    ["changeable", "display"],
                    {
                        changeable: new FieldChecker({ type: "boolean" }),
                        display: new FieldChecker({ type: "boolean" }),
                        min: new FieldChecker({ type: "number", checker: [q => q >= 0] }),
                        max: new FieldChecker({ type: "number", checker: [q => q >= 0] }),
                    },
                ]),
                actions: new FieldsContainer([
                    "array",
                    new FieldsContainer([
                        ["name"],
                        {
                            name: new FieldChecker({ type: "string" }),
                            handler: new FieldChecker({ type: "function" }),
                        },
                    ]),
                ]),
                functions: new FieldsContainer([
                    "array",
                    new FieldsContainer([
                        ["name"],
                        {
                            name: new FieldChecker({ type: "string", symbols: "a-z0-9-" }),
                            handler: new FieldChecker({ type: "function" }),
                        },
                    ]),
                ]),
            },
        ]).set(data)
        if ("config" in data && data.config.changeable === true) {
            if (!("min" in data.config)
                || !("max" in data.config)
                || data.config.max < data.config.min) throw new Error("Incorrect statement")
        }

        this._register.push(data);

        (async () => {
            if (await data.size() > await data.quota()) {
                const autoClean = data.functions.find(e => e.name === "auto-clean")
                if (autoClean) autoClean.handler()
            }
        })()
    }

    static getAll() {
        return this._register
    }

    static get(id) {
        return this._register.find(e => e.id === id)
    }

    static generateSettingsLayout(act) {
        const list = this.getAll()

        list.forEach((e) => {
            const sectionName = `db-user-presence-section-${e.id}`
            const groupName = `db-user-presence-group-${e.id}`
            const descriptionName = `db-user-presence-description-${e.id}`

            let sizeContainer

            async function calculateSize() {
                const byteSize = await e.size()
                const byteQuota = await e.quota()
                const size = fileSizeForHuman(byteSize)
                const quota = fileSizeForHuman(byteQuota)
                sizeContainer.clear(new DOM({
                    new: "div",
                    content: [
                        `${$$("@settings/storage/used")} ${size} ${$("@settings/storage/of")} ${quota}`,
                        ...(byteSize > byteQuota
                            ? [
                                new IconSide(
                                    "warning",
                                    (e.functions.find(er => er.name === "auto-clean") ? $$("@settings/storage/cleanup_planned") : $$("@settings/storage/over_quota")),
                                ),
                            ]
                            : []),
                    ],
                }))
            }

            async function updateStatus() {
                calculateSize()
            }

            sizeContainer = new DOM({ new: "div", content: `${$$("@settings/storage/calculating")}...`, onRender: updateStatus })

            act.createSection({
                id: sectionName,
                options: {
                    name: new IconSide(e.icon, e.name, { normalIcon: true }),
                },
                dom: SettingsSectionElement,
            })
                .getSection(sectionName)
                .createGroup({
                    id: groupName,
                    options: {},
                    dom: SettingsGroupContainer,
                })
                .getGroup(groupName)
                .createItem({
                    id: descriptionName,
                    dom: CardList,
                    options: [
                        { content: e.description },
                        {
                            content: sizeContainer,
                        },
                        {
                            content: new DOM({
                                new: "div",
                                content: e.actions.map(action => new Button({
                                    content: action.name,
                                    async handler(...a) {
                                        await action.handler(...a)
                                        updateStatus()
                                    },
                                })),
                            }),
                        },
                    ],
                })
        })
    }
}
