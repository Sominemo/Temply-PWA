import DOM from "@DOMPath/DOM/Classes/dom"
import { $$ } from "@Core/Services/Language/handler"
import TextWithSubtext from "@Environment/Library/DOM/object/textWithSubtext"
import { SettingsSectionElement, SettingsGroupContainer } from "@Environment/Library/DOM/settings"
import { RadioLabel } from "@Environment/Library/DOM/object/input"
import SettingsStorage from "@Core/Services/Settings/SettingsStorage"
import reloadToast from "@App/tools/interaction/reloadToast"
import Design from "@Core/Services/design"

export default async function generateThemesList(act) {
    const self = Design
    const themes = Design.themesList

    const list = themes.map(theme => ({
        content: new DOM({
            new: "div",
            content: [
                new DOM({ new: "div", content: (theme.name_loc ? $$(`@settings/appearance/themes/names/${theme.name_loc}`) : theme.name) }),
                new DOM({
                    new: "div",
                    style: {
                        display: "flex",
                        alignItems: "center",
                    },
                    content:
                        [
                            ...Object.values(theme.colors).map(color => new DOM({
                                new: "div",
                                style: {
                                    background: color,
                                    width: "10px",
                                    height: "10px",
                                    borderRadius: "50%",
                                    margin: "3px",
                                    boxShadow: "0px 0px 3px rgba(204, 204, 204, 0.9)",
                                },
                            })),
                            new DOM({ new: "div", content: `| ${theme.author}`, style: { color: Design.getVar("color-generic-light-b"), fontSize: "12px", marginLeft: "5px" } }),
                        ],
                }),
            ],
        }),
        handler(s) {
            if (!s) return
            self.themeLoader(theme.dir)
        },
        selected: () => (theme.dir === this.theme && self.isAutomatic !== true),
    }))

    list.unshift({
        content: new TextWithSubtext(
            $$("@settings/appearance/themes/names/system"),
            $$("@settings/appearance/themes/system_theme_info"),
        ),
        handler(s) {
            if (!s) return
            localStorage.removeItem(self.LSName)
            self.themeLoader()
        },
        selected: () => (self.isAutomatic === true),
    })

    act.createSection({ id: "theme-selection-section", dom: SettingsSectionElement, options: { name: $$("@settings/appearance/themes") } })
        .getSection("theme-selection-section")
        .createGroup({ id: "theme-selection-group", dom: SettingsGroupContainer, options: {} })
        .getGroup("theme-selection-group")
        .createItem({ id: "theme-selection-chooser-radios", dom: ({ items }) => new DOM({ new: "div", content: new RadioLabel(items, [], true) }), options: { items: list } })


    const AWT = !!(await SettingsStorage.getFlag("ui_wm_adv_transitions"))
    const AWTCSS = !!(await SettingsStorage.getFlag("ui_wm_adv_css_transitions"))
    const NoAnimation = !!(await SettingsStorage.getFlag("ui_wm_no_transitions"))

    const windowTransitions = [
        {
            content: new TextWithSubtext(
                $$("@settings/appearance/animations/optimized"),
                $$("@settings/appearance/animations/optimized/info"),
            ),
            handler(s) {
                if (!s) return
                SettingsStorage.setFlag("ui_wm_no_transitions", 0)
                SettingsStorage.setFlag("ui_wm_adv_transitions", 1)
                SettingsStorage.setFlag("ui_wm_adv_css_transitions", 1)
                reloadToast()
            },
            selected: () => (AWT && AWTCSS && !NoAnimation),
        },
        {
            content: new TextWithSubtext(
                $$("@settings/appearance/animations/simple"),
                $$("@settings/appearance/animations/simple/info"),
            ),
            handler(s) {
                if (!s) return
                SettingsStorage.setFlag("ui_wm_no_transitions", 0)
                SettingsStorage.setFlag("ui_wm_adv_transitions", 0)
                SettingsStorage.setFlag("ui_wm_adv_css_transitions", 0)
                reloadToast()
            },
            selected: () => (!AWT && !NoAnimation),
        },
        {
            content: new TextWithSubtext(
                $$("@settings/appearance/animations/stable"),
                $$("@settings/appearance/animations/stable/info"),
            ),
            handler(s) {
                if (!s) return
                SettingsStorage.setFlag("ui_wm_no_transitions", 0)
                SettingsStorage.setFlag("ui_wm_adv_transitions", 1)
                SettingsStorage.setFlag("ui_wm_adv_css_transitions", 0)
                reloadToast()
            },
            selected: () => (AWT && !AWTCSS && !NoAnimation),
        },
        {
            content: new TextWithSubtext(
                $$("@settings/appearance/animations/no_animation"),
                $$("@settings/appearance/animations/no_animation/info"),
            ),
            handler(s) {
                if (!s) return
                SettingsStorage.setFlag("ui_wm_no_transitions", 1)
                SettingsStorage.setFlag("ui_wm_adv_transitions", 0)
                SettingsStorage.setFlag("ui_wm_adv_css_transitions", 0)
                reloadToast()
            },
            selected: () => (!AWT && !AWTCSS && NoAnimation),
        },

    ]

    act.createSection({ id: "window-transition-section", dom: SettingsSectionElement, options: { name: $$("@settings/appearance/window_transition") } })
        .getSection("window-transition-section")
        .createGroup({ id: "window-transition-group", dom: SettingsGroupContainer, options: {} })
        .getGroup("window-transition-group")
        .createItem({ id: "window-transition-radios", dom: ({ items }) => new DOM({ new: "div", content: new RadioLabel(items, [], true) }), options: { items: windowTransitions } })
}
