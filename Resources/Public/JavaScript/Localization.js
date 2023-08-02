/*
 * This file is part of the TYPO3 CMS project.
 *
 * It is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License, either version 2
 * of the License, or any later version.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 * The TYPO3 project - inspiring people to share!
 */
import DocumentService from "@typo3/core/document-service.js";
import $ from "jquery";
import {SeverityEnum} from "@typo3/backend/enum/severity.js";
import AjaxRequest from "@typo3/core/ajax/ajax-request.js";
import Icons from "@typo3/backend/icons.js";
import Wizard from "@typo3/backend/wizard.js";
import "@typo3/backend/element/icon-element.js";

class Localization {
    triggerButton = ".t3js-localize"
    localizationMode = null
    sourceLanguage = null
    records = []

    constructor() {
        DocumentService.ready().then(() => {
            this.initialize()
        })
    }

    initialize() {
        const me = this
        Icons.getIcon("actions-localize", Icons.sizes.large).then(
            localizeIconMarkup => {
                Icons.getIcon("actions-edit-copy", Icons.sizes.large).then(
                    copyIconMarkup => {
                        Icons.getIcon("actions-localize-deepl", Icons.sizes.large).then(
                            localizeDeeplIconMarkup => {
                                $(me.triggerButton).removeClass("disabled")

                                $(document).on("click", me.triggerButton, e => {
                                    e.preventDefault()

                                    const $triggerButton = $(e.currentTarget)
                                    const actions = []
                                    const availableLocalizationModes = []
                                    let slideStep1 = ""

                                    if ($triggerButton.data("allowTranslate")) {
                                        actions.push(
                                            '<div class="row">' +
                                            '<div class="col-sm-3">' +
                                            '<label class="btn btn-default d-block t3js-localization-option" data-helptext=".t3js-helptext-translate">' +
                                            localizeIconMarkup +
                                            '<input type="radio" name="mode" id="mode_translate" value="localize" style="display: none">' +
                                            "<br>" +
                                            TYPO3.lang["localize.wizard.button.translate"] +
                                            "</label>" +
                                            "</div>" +
                                            '<div class="col-sm-9">' +
                                            '<p class="t3js-helptext t3js-helptext-translate text-body-secondary">' +
                                            TYPO3.lang["localize.educate.translate"] +
                                            "</p>" +
                                            "</div>" +
                                            "</div>"
                                        )
                                        actions.push(
                                            '<div class="row">' +
                                            '<div class="col-sm-3">' +
                                            '<label class="btn btn-default d-block t3js-localization-option" data-helptext=".t3js-helptext-translate">' +
                                            localizeDeeplIconMarkup +
                                            '<input type="radio" name="mode" id="mode_deepltranslate" value="mode_deepltranslateauto" style="display: none">' +
                                            "<br>Translate<br>(deepl)<br>(autodetect)</label>" +
                                            "</div>" +
                                            '<div class="col-sm-9">' +
                                            '<p class="t3js-helptext t3js-helptext-translate text-body-secondary">' +
                                            TYPO3.lang["localize.educate.deepltranslateAuto"] +
                                            "</p>" +
                                            "</div>" +
                                            "</div>"
                                        )
                                        actions.push(
                                            '<div class="row">' +
                                            '<div class="col-sm-3">' +
                                            '<label class="btn btn-default d-block t3js-localization-option" data-helptext=".t3js-helptext-translate">' +
                                            localizeDeeplIconMarkup +
                                            '<input type="radio" name="mode" id="mode_deepltranslate" value="localizedeepl" style="display: none">' +
                                            "<br>Translate<br>(deepl)</label>" +
                                            "</div>" +
                                            '<div class="col-sm-9">' +
                                            '<p class="t3js-helptext t3js-helptext-translate text-body-secondary">' +
                                            TYPO3.lang["localize.educate.deepltranslate"] +
                                            "</p>" +
                                            "</div>" +
                                            "</div>"
                                        )
                                        availableLocalizationModes.push("localize")
                                    }

                                    if ($triggerButton.data("allowCopy")) {
                                        actions.push(
                                            '<div class="row">' +
                                            '<div class="col-sm-3">' +
                                            '<label class="btn btn-default d-block t3js-localization-option" data-helptext=".t3js-helptext-copy">' +
                                            copyIconMarkup +
                                            '<input type="radio" name="mode" id="mode_copy" value="copyFromLanguage" style="display: none">' +
                                            "<br>" +
                                            TYPO3.lang["localize.wizard.button.copy"] +
                                            "</label>" +
                                            "</div>" +
                                            '<div class="col-sm-9">' +
                                            '<p class="t3js-helptext t3js-helptext-copy text-body-secondary">' +
                                            TYPO3.lang["localize.educate.copy"] +
                                            "</p>" +
                                            "</div>" +
                                            "</div>"
                                        )
                                        availableLocalizationModes.push("copyFromLanguage")
                                    }

                                    if (
                                        $triggerButton.data("allowTranslate") === 0 &&
                                        $triggerButton.data("allowCopy") === 0
                                    ) {
                                        actions.push(
                                            '<div class="row">' +
                                            '<div class="col-sm-12">' +
                                            '<div class="alert alert-warning">' +
                                            '<div class="media">' +
                                            '<div class="media-left">' +
                                            '<span class="icon-emphasized"><typo3-backend-icon identifier="actions-exclamation" size="small"></typo3-backend-icon></span>' +
                                            "</div>" +
                                            '<div class="media-body">' +
                                            '<p class="alert-message">' +
                                            TYPO3.lang["localize.educate.noTranslate"] +
                                            "</p>" +
                                            "</div>" +
                                            "</div>" +
                                            "</div>" +
                                            "</div>" +
                                            "</div>"
                                        )
                                    }

                                    slideStep1 +=
                                        '<div data-bs-toggle="buttons">' +
                                        actions.join("") +
                                        "</div>"
                                    Wizard.addSlide(
                                        "localize-choose-action",
                                        TYPO3.lang["localize.wizard.header_page"]
                                            .replace("{0}", $triggerButton.data("page"))
                                            .replace("{1}", $triggerButton.data("languageName")),
                                        slideStep1,
                                        SeverityEnum.info,
                                        () => {
                                            if (availableLocalizationModes.length === 1) {
                                                // In case only one mode is available, select the mode and continue
                                                this.localizationMode = availableLocalizationModes[0]
                                                Wizard.unlockNextStep().trigger("click")
                                            }
                                        }
                                    )
                                    Wizard.addSlide(
                                        "localize-choose-language",
                                        TYPO3.lang["localize.view.chooseLanguage"],
                                        "",
                                        SeverityEnum.info,
                                        $slide => {
                                            Icons.getIcon("spinner-circle", Icons.sizes.large).then(
                                                markup => {
                                                    $slide.html(
                                                        '<div class="text-center">' + markup + "</div>"
                                                    )

                                                    this.loadAvailableLanguages(
                                                        parseInt($triggerButton.data("pageId"), 10),
                                                        parseInt($triggerButton.data("languageId"), 10)
                                                    ).then(async response => {
                                                        const result = await response.resolve()
                                                        if (result.length === 1) {
                                                            // We only have one result, auto select the record and continue
                                                            this.sourceLanguage = result[0].uid
                                                            Wizard.unlockNextStep().trigger("click")
                                                            return
                                                        }

                                                        Wizard.getComponent().on(
                                                            "click",
                                                            ".t3js-language-option",
                                                            optionEvt => {
                                                                const $me = $(optionEvt.currentTarget)
                                                                const $radio = $me.prev()

                                                                this.sourceLanguage = $radio.val()
                                                                Wizard.unlockNextStep()
                                                            }
                                                        )

                                                        const $languageButtons = $("<div />", {
                                                            class: "row"
                                                        })

                                                        for (const languageObject of result) {
                                                            const id = "language" + languageObject.uid
                                                            const $input = $("<input />", {
                                                                type: "radio",
                                                                name: "language",
                                                                id: id,
                                                                value: languageObject.uid,
                                                                style: "display: none;",
                                                                class: "btn-check"
                                                            })
                                                            const $label = $("<label />", {
                                                                class:
                                                                    "btn btn-default d-block t3js-language-option option",
                                                                for: id
                                                            })
                                                                .text(" " + languageObject.title)
                                                                .prepend(languageObject.flagIcon)

                                                            $languageButtons.append(
                                                                $("<div />", { class: "col-sm-4" })
                                                                    .append($input)
                                                                    .append($label)
                                                            )
                                                        }
                                                        $slide.empty().append($languageButtons)
                                                    })
                                                }
                                            )
                                        }
                                    )
                                    Wizard.addSlide(
                                        "localize-summary",
                                        TYPO3.lang["localize.view.summary"],
                                        "",
                                        SeverityEnum.info,
                                        $slide => {
                                            Icons.getIcon("spinner-circle", Icons.sizes.large).then(
                                                markup => {
                                                    $slide.html(
                                                        '<div class="text-center">' + markup + "</div>"
                                                    )
                                                }
                                            )
                                            this.getSummary(
                                                parseInt($triggerButton.data("pageId"), 10),
                                                parseInt($triggerButton.data("languageId"), 10)
                                            ).then(async response => {
                                                const result = await response.resolve()
                                                $slide.empty()
                                                this.records = []

                                                const columns = result.columns.columns
                                                const columnList = result.columns.columnList

                                                columnList.forEach(colPos => {
                                                    if (typeof result.records[colPos] === "undefined") {
                                                        return
                                                    }

                                                    const column = columns[colPos]
                                                    const $row = $("<div />", { class: "row" })

                                                    result.records[colPos].forEach(record => {
                                                        const label =
                                                            " (" + record.uid + ") " + record.title
                                                        this.records.push(record.uid)

                                                        $row.append(
                                                            $("<div />", { class: "col-sm-6" }).append(
                                                                $("<div />", { class: "input-group" }).append(
                                                                    $("<span />", {
                                                                        class: "input-group-addon"
                                                                    }).append(
                                                                        $("<input />", {
                                                                            type: "checkbox",
                                                                            class: "t3js-localization-toggle-record",
                                                                            id: "record-uid-" + record.uid,
                                                                            checked: "checked",
                                                                            "data-uid": record.uid,
                                                                            "aria-label": label
                                                                        })
                                                                    ),
                                                                    $("<label />", {
                                                                        class: "form-control",
                                                                        for: "record-uid-" + record.uid
                                                                    })
                                                                        .text(label)
                                                                        .prepend(record.icon)
                                                                )
                                                            )
                                                        )
                                                    })

                                                    $slide.append(
                                                        $("<fieldset />", {
                                                            class: "localization-fieldset"
                                                        }).append(
                                                            $("<label />")
                                                                .text(column)
                                                                .prepend(
                                                                    $("<input />", {
                                                                        class: "t3js-localization-toggle-column",
                                                                        type: "checkbox",
                                                                        checked: "checked"
                                                                    })
                                                                ),
                                                            $row
                                                        )
                                                    )
                                                })

                                                Wizard.unlockNextStep()

                                                Wizard.getComponent()
                                                    .on(
                                                        "change",
                                                        ".t3js-localization-toggle-record",
                                                        cmpEvt => {
                                                            const $me = $(cmpEvt.currentTarget)
                                                            const uid = $me.data("uid")
                                                            const $parent = $me.closest("fieldset")
                                                            const $columnCheckbox = $parent.find(
                                                                ".t3js-localization-toggle-column"
                                                            )

                                                            if ($me.is(":checked")) {
                                                                this.records.push(uid)
                                                            } else {
                                                                const index = this.records.indexOf(uid)
                                                                if (index > -1) {
                                                                    this.records.splice(index, 1)
                                                                }
                                                            }

                                                            const $allChildren = $parent.find(
                                                                ".t3js-localization-toggle-record"
                                                            )
                                                            const $checkedChildren = $parent.find(
                                                                ".t3js-localization-toggle-record:checked"
                                                            )

                                                            $columnCheckbox.prop(
                                                                "checked",
                                                                $checkedChildren.length > 0
                                                            )
                                                            $columnCheckbox.prop(
                                                                "indeterminate",
                                                                $checkedChildren.length > 0 &&
                                                                $checkedChildren.length < $allChildren.length
                                                            )

                                                            if (this.records.length > 0) {
                                                                Wizard.unlockNextStep()
                                                            } else {
                                                                Wizard.lockNextStep()
                                                            }
                                                        }
                                                    )
                                                    .on(
                                                        "change",
                                                        ".t3js-localization-toggle-column",
                                                        toggleEvt => {
                                                            const $me = $(toggleEvt.currentTarget)
                                                            const $children = $me
                                                                .closest("fieldset")
                                                                .find(".t3js-localization-toggle-record")

                                                            $children.prop("checked", $me.is(":checked"))
                                                            $children.trigger("change")
                                                        }
                                                    )
                                            })
                                        }
                                    )

                                    Wizard.addFinalProcessingSlide(() => {
                                        this.localizeRecords(
                                            parseInt($triggerButton.data("pageId"), 10),
                                            parseInt($triggerButton.data("languageId"), 10),
                                            this.records
                                        ).then(() => {
                                            Wizard.dismiss()
                                            document.location.reload()
                                        })
                                    }).then(() => {
                                        Wizard.show()

                                        Wizard.getComponent().on(
                                            "click",
                                            ".t3js-localization-option",
                                            optionEvt => {
                                                const $me = $(optionEvt.currentTarget)
                                                const $radio = $me.find('input[type="radio"]')

                                                if ($me.data("helptext")) {
                                                    const $container = $(optionEvt.delegateTarget)
                                                    $container
                                                        .find(".t3js-localization-option")
                                                        .removeClass("active")
                                                    $container
                                                        .find(".t3js-helptext")
                                                        .addClass("text-body-secondary")
                                                    $me.addClass("active")
                                                    $container
                                                        .find($me.data("helptext"))
                                                        .removeClass("text-body-secondary")
                                                }
                                                this.localizationMode = $radio.val()
                                                Wizard.unlockNextStep()
                                            }
                                        )
                                    })
                                })
                            }
                        )
                    }
                )
            }
        )
    }

    /**
     * Load available languages from page
     *
     * @param {number} pageId
     * @param {number} languageId
     * @returns {Promise<AjaxResponse>}
     */
    loadAvailableLanguages(pageId, languageId) {
        return new AjaxRequest(TYPO3.settings.ajaxUrls.page_languages)
            .withQueryArguments({
                pageId: pageId,
                languageId: languageId
            })
            .get()
    }

    /**
     * Get summary for record processing
     *
     * @param {number} pageId
     * @param {number} languageId
     * @returns {Promise<AjaxResponse>}
     */
    getSummary(pageId, languageId) {
        return new AjaxRequest(TYPO3.settings.ajaxUrls.records_localize_summary)
            .withQueryArguments({
                pageId: pageId,
                destLanguageId: languageId,
                languageId: this.sourceLanguage
            })
            .get()
    }

    /**
     * Localize records
     *
     * @param {number} pageId
     * @param {number} languageId
     * @param {Array<number>} uidList
     * @returns {Promise<AjaxResponse>}
     */
    localizeRecords(pageId, languageId, uidList) {
        return new AjaxRequest(TYPO3.settings.ajaxUrls.records_localize)
            .withQueryArguments({
                pageId: pageId,
                srcLanguageId: this.sourceLanguage,
                destLanguageId: languageId,
                action: this.localizationMode,
                uidList: uidList
            })
            .get()
    }
}

export default new Localization;