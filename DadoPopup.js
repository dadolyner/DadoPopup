/*
MIT License

Copyright (c) 2022 David Skulj
Copyright (c) 2022 Jože Vovk

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

// @ts-check
"use strict";

/** @typedef {{ value: any, show: () => void, hide: () => void, success: () => void, error: () => void, reset: () => void }} DadoPopup_Callback_Data */

/** @typedef { ({...DadoPopup_Callback_Data}) => (void | Promise) } DadoPopup_OnChange */

/** @typedef {{ id?: string; label?: string; hidden?: boolean; onChange?: DadoPopup_OnChange; onFocusOut?: DadoPopup_OnChange; margin?: number; customClass?: string; }} DadoPopupInputCommon */

/** @typedef {{ id?: string; type: 'spacer'; margin?: number; color?: string, customClass?: string; hidden?: boolean; }} DadoPopupInputSpacer */
/** @typedef { DadoPopupInputCommon & { type: 'text'; name: string; fontFamily?: string; placeholder?: string; value?: string; keyboard?: 'text' | 'numpad'; }} DadoPopupInputOptionText */
/** @typedef { DadoPopupInputCommon & { type: 'date'; name: string; value?: string; keyboard?: 'text'; }} DadoPopupInputOptionDate */
/** @typedef { DadoPopupInputCommon & { type: 'time'; name: string; value?: string; keyboard?: 'text'; }} DadoPopupInputOptionTime */
/** @typedef { DadoPopupInputCommon & { type: 'datetime'; name: string; value?: string; keyboard?: 'text'; }} DadoPopupInputOptionDateTime */
/** @typedef { DadoPopupInputCommon & { type: 'button'; value?: String; color?: string; onClick: DadoPopup_OnChange }} DadoPopupInputOptionButton */
/** @typedef { DadoPopupInputCommon & { type: 'textArea'; name: string; fontFamily?: string; placeholder?: string; value?: string; keyboard?: 'text' | 'numpad'; }} DadoPopupInputOptionTextArea */
/** @typedef { DadoPopupInputCommon & { type: 'password'; name: string; placeholder?: string; keyboard?: 'text' | 'numpad'; }} DadoPopupInputOptionPassword*/
/** @typedef { DadoPopupInputCommon & { type: 'number'; name: string; placeholder?: string; value?: number; keyboard?: 'numpad'; }} DadoPopupInputOptionNumber */
/** @typedef { DadoPopupInputCommon & { type: 'range'; name: string; value?: number; min?: number; max?: number; step?: number; }} DadoPopupInputOptionRange */
/** @typedef { DadoPopupInputCommon & { type: 'boolean'; name: string; value?: number | boolean; }} DadoPopupInputOptionBoolean */
/** @typedef { DadoPopupInputCommon & { type: 'toggle'; name: string; value?: number | boolean; }} DadoPopupInputOptionToggle */
/** @typedef { DadoPopupInputCommon & { type: 'checkbox'; name: string; value?: number | boolean; }} DadoPopupInputOptionCheckbox */
/** @typedef { DadoPopupInputCommon & { type: 'dropdown'; name: string; options: string[]; numbered?: boolean; value?: string; }} DadoPopupInputOptionDropdown */
/** @typedef { DadoPopupInputCommon & { type: 'dropdown-search'; name: string; options: string[]; numbered?: boolean; value?: string; }} DadoPopupInputOptionDropdownSearch */
/** @typedef { DadoPopupInputCommon & { type: 'color'; name: string; placeholder?: string; value?: String; }} DadoPopupInputOptionColor */
/** @typedef { DadoPopupInputCommon & { type: 'url'; name: string; placeholder?: string; value?: string; keyboard?: 'text'; }} DadoPopupInputOptionURL */
/** @typedef { DadoPopupInputCommon & { type: 'file'; name: string; placeholder?: string; file_type?: string | string[]; }} DadoPopupInputOptionFile */
/** @typedef { DadoPopupInputCommon & { type: 'html'; value?: string; }} DadoPopupInputOptionHTML */

/** @typedef { DadoPopupInputSpacer | DadoPopupInputOptionText | DadoPopupInputOptionTextArea | DadoPopupInputOptionPassword | DadoPopupInputOptionNumber | DadoPopupInputOptionRange | DadoPopupInputOptionDate | DadoPopupInputOptionTime | DadoPopupInputOptionDateTime | DadoPopupInputOptionBoolean | DadoPopupInputOptionDropdown | DadoPopupInputOptionDropdownSearch | DadoPopupInputOptionButton | DadoPopupInputOptionColor | DadoPopupInputOptionHTML | DadoPopupInputOptionToggle | DadoPopupInputOptionCheckbox | DadoPopupInputOptionURL | DadoPopupInputOptionFile } DadoPopupInputOption */
/** @typedef {{ id?: String; status: String; text: String; customClass?: String; backgroundColor?: String; textColor?: String; onClick?: DadoPopup_OnChange, verify?: DadoPopup_OnChange }} DadoPopupEndorseButton */

/**
 * @typedef {{
 *      title?: string,
 *      style?: 'dark' | 'light',
 *      buttons?: DadoPopupEndorseButton[],
 *      size?: 'small' | 'medium' | 'large' | 'extra-large' | 'full-screen',
 *      confirmButtonText?: String,
 *      preConfirm?: () => void | Promise,
 *      backdrop?: boolean,
 *      closeWarning?: boolean | {
 *          title?: string,
 *          text?: string,
 *          confirmButtonText?: string,
 *      },
 *      allowEnterKey?: true
 * }} DadoPopupOptionsDefault
*/

/**
 * @typedef { DadoPopupOptionsDefault & {
 *      type: 'info',
 *      text: string,
 * }} DadoPopupOptionsInfo
*/
/**
 * @typedef { DadoPopupOptionsDefault & {
 *      type: 'warn',
 *      text: string,
 * }} DadoPopupOptionsWarn
*/
/**
 * @typedef { DadoPopupOptionsDefault & {
 *      type: 'alert',
 *      text: string,
 * }} DadoPopupOptionsAlert
*/

/**
 * @typedef { DadoPopupOptionsDefault & {
 *      type: 'form',
 *      inputs?: DadoPopupInputOption[],
 * }} DadoPopupOptionsForm
*/


class DADOPOPUP_CLASS {
    constructor() {
        this.___temporaryCallbacks = {} // Used to store callbacks for inputs
        this.___popupTriggerNext = {}
        this.call_callback = (id) => this.___temporaryCallbacks[id] && this.___temporaryCallbacks[id]()
        this.call_next = (id) => this.___popupTriggerNext[id] && this.___popupTriggerNext[id](event)

        const dado_draggables = [] // Array of html elements that can be dragged
        this.setTranslate = (xPos, yPos, el) => el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)"
        this.addDraggableDado = e => !dado_draggables.includes(e) && dado_draggables.push(e)
        this.removeDraggableDado = e => dado_draggables.includes(e) && dado_draggables.splice(dado_draggables.indexOf(e), 1);
        const load = async () => { // Initialize draggable elements
            const body = document.querySelector("body")
            let activeElement
            let currentX
            let currentY
            let initialX
            let initialY
            let xOffset = 0
            let yOffset = 0
            const dragStart = (e) => {
                activeElement = dado_draggables.find(el => el.header === e.target)
                if (!activeElement) return
                xOffset = activeElement.x
                yOffset = activeElement.y
                if (e.type === "touchstart") { initialX = e.touches[0].clientX - xOffset; initialY = e.touches[0].clientY - yOffset }
                else { initialX = e.clientX - xOffset; initialY = e.clientY - yOffset }
            }
            const drag = (e) => {
                if (activeElement) {
                    e.preventDefault()
                    if (e.type === "touchmove") { currentX = e.touches[0].clientX - initialX; currentY = e.touches[0].clientY - initialY }
                    else { currentX = e.clientX - initialX; currentY = e.clientY - initialY }
                    xOffset = currentX
                    yOffset = currentY
                    activeElement.x = xOffset
                    activeElement.y = yOffset
                    this.setTranslate(currentX, currentY, activeElement.modal)
                }
            }
            const dragEnd = () => activeElement = undefined
            body.addEventListener("touchstart", dragStart, false)
            body.addEventListener("touchend", dragEnd, false)
            body.addEventListener("touchmove", drag, false)
            body.addEventListener("mousedown", dragStart, false)
            body.addEventListener("mouseup", dragEnd, false)
            body.addEventListener("mousemove", drag, false)
            window.removeEventListener("load", load)
        }
        window.addEventListener('load', load)
    }

    file_reader = (files, justChecking = false) => new Promise(async (resolve, reject) => {
        try {
            if (files.length > 1) return resolve(await Promise.all(files.filter(Boolean).map(file => this.file_reader(file, justChecking))))
            const file = files.length === 1 ? files[0] : files
            if (justChecking) return resolve({ name: file.name, type: file.type, size: file.size, lastModified: file.lastModified })
            const reader = new FileReader()
            reader.onerror = reject
            reader.readAsDataURL(file)
            reader.onload = () => resolve({ name: file.name, type: file.type, size: file.size, lastModified: file.lastModified, data: reader.result })
        } catch (e) { reject(e) }
    })

    /** @param { DadoPopupOptionsInfo | DadoPopupOptionsForm } options */
    popup = options => new Promise(async (resolve, reject) => {
        try {
            const keys = Object.keys(options)
            const delay = ms => new Promise(resolve2 => setTimeout(resolve2, ms))
            const genString = (len = 10, custom = '') => { const chars = custom || 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; let result = ''; for (let i = 0; i < len; i++) result += chars.charAt(Math.floor(Math.random() * chars.length)); return result }
            options.preConfirm = options.preConfirm || (() => { })
            options.confirmButtonText = options.confirmButtonText || 'OK'
            options.style = options.style || 'light'
            /** @type { DadoPopupInputOption[] } */
            const inputs = (options.type === 'form' ? options.inputs : [{ type: 'html', value: options.text }]) || []
            options.buttons = options.buttons && Array.isArray(options.buttons) && options.buttons.length > 0 ? options.buttons : [{ text: options.confirmButtonText, status: 'confirmed' }]
            if (!keys.includes('backdrop')) options.backdrop = true
            const { buttons, style, preConfirm, allowEnterKey, backdrop, closeWarning } = options

            const modal_id = 'x' + genString(12)
            const close_id = `${modal_id}_close`
            const input_group_id = `${modal_id}_input`
            const first_id = `${modal_id}_input_first`

            if (allowEnterKey) {
                let busy = false
                this.___popupTriggerNext[modal_id] = (e) => {
                    if (busy) return
                    busy = true
                    const ctrl = e.ctrlKey
                    const alt = e.altKey
                    const shift = e.shiftKey
                    if (e.key === 'Enter' && !ctrl && !alt && !shift) {
                        const element = document.activeElement
                        if (element) {
                            const n = element ? element.nextSibling : null
                            const next = n ? n.nextSibling : null // @ts-ignore
                            while (next && next.style.display === 'none') next = next.nextSibling.nextSibling
                            const hasNext = !!next
                            if (hasNext) { // @ts-ignore
                                next.focus()
                                const type = next.nodeName.toLowerCase()
                                const targetTypes = ['input', 'textarea'] // @ts-ignore
                                if (targetTypes.includes(type)) { const val = next.value; next.value = ''; next.value = val }
                            } else document.getElementById(`${modal_id}_${buttons[0].id}`).click()
                        }
                        e.preventDefault()
                    }
                    busy = false
                }
            }

            const readValues = async (finalReadout = false) => {
                const values = {}
                let s = 1
                for (const input of inputs) {
                    const { type, id } = input
                    if (finalReadout) {
                        if (type !== 'spacer' && type !== 'html' && type !== 'button') {
                            const { name, type } = input // @ts-ignore
                            values[name] = document.getElementById(`${modal_id}_${id}`).value
                            if (type === 'number') values[name] = values[name] !== '' ? Number(values[name]) : null // @ts-ignore
                            if (type === 'checkbox' || type === 'toggle' || type === 'boolean') values[name] = document.getElementById(`${modal_id}_${id}`).checked
                            if (type === 'date' && values[name] && values[name].includes('T')) values[name] = values[name].split('T')[0]
                            if (type === 'time' && values[name] && values[name].includes('T')) values[name] = values[name].split('T')[1].split('Z')[0]
                            if (type === 'file') { // @ts-ignore
                                const files_input = document.getElementById(`${modal_id}_${id}`).files
                                if (files_input && files_input.length > 0) values[name] = await this.file_reader(files_input)
                            }
                        }
                    } else {
                        const name = type !== 'spacer' && type !== 'html' && type !== 'button' ? input.name : `spacer_${s++}`
                        const element = document.getElementById(`${modal_id}_${id}`) // @ts-ignore
                        let value = type !== 'spacer' && type !== 'html' && type !== 'button' && type !== 'file' ? element.value : ''
                        if (type === 'number') value = value !== '' && Number.isFinite(+value) ? Number(value) : '' //  @ts-ignore
                        if (type === 'checkbox' || type === 'toggle' || type === 'boolean') value = element.checked
                        if (type === 'date' && value && value.includes('T')) value = value.split('T')[0]
                        if (type === 'time' && value && value.includes('T')) value = value.split('T')[1].split('Z')[0]
                        if (type === 'file') { // @ts-ignore
                            const files_input = document.getElementById(`${modal_id}_${id}`).files
                            if (files_input && files_input.length > 0) value = await this.file_reader(files_input, true) // Just get file info
                        }
                        /** @type { DadoPopup_Callback_Data } */
                        const output = {
                            value, // @ts-ignore
                            hide: () => { element.style.display = 'none'; if (element.previousSibling && element.previousSibling.style) element.previousSibling.style.display = 'none' }, // @ts-ignore
                            show: () => { element.style.display = 'block'; if (element.previousSibling && element.previousSibling.style) element.previousSibling.style.display = 'block' },
                            success: () => { element.classList.add('input-success'); element.classList.remove('input-error') },
                            error: () => { element.classList.add('input-error'); element.classList.remove('input-success') },
                            reset: () => { element.classList.remove('input-success'); element.classList.remove('input-error') },
                        }
                        values[name] = output
                    }
                }
                return values
            }

            const writeValues = async values => {
                inputs.forEach(input => {
                    const { type } = input
                    if (type !== 'spacer' && type !== 'html' && type !== 'button' && type !== 'file') {
                        const { id, name } = input
                        let value = values[name] ? values[name].value : ''
                        if (type === 'number') value = value !== '' && Number.isFinite(+value) ? Number(value) : '' //  @ts-ignore
                        document.getElementById(`${modal_id}_${id}`).value = value //  @ts-ignore
                        if (type === 'checkbox' || type === 'toggle' || type === 'boolean') document.getElementById(`${modal_id}_${id}`).checked = !!value
                    }
                })
            }

            /** @param { String } input_id * @param { ({...any}) => void | Promise } callback * @param { 'cb' | 'click' | 'change' | 'done' | 'rangeChange' } group */
            const addCallback = (input_id, callback, group = 'cb') => {
                if (!callback) return
                const id = modal_id + '_' + input_id + '_' + group
                let busy = false
                this.___temporaryCallbacks[id] = async () => {
                    if (busy) return
                    busy = true
                    try {
                        await delay(10)
                        const values = await readValues()
                        await callback(values)
                        await writeValues(values)
                    } catch (e) { console.error(e) }
                    busy = false
                }
            }

            /** @param {DadoPopupInputOption} input */
            const compileInput = input => {
                input.id = input.id || ('i' + genString(12))
                input.type = input.type || 'text'
                const { id, type } = input
                input.customClass = input.customClass || ''
                if (type === 'text' || type === 'textArea' || type === 'password' || type === 'number' || type === 'color' || type === 'url' || type === 'file') input.placeholder = input.placeholder || ''
                if (type !== 'spacer' && type !== 'password' && type !== 'file') input.value = input.value === undefined ? '' : input.value
                if (type === 'dropdown') input.options = (input.options || []).flat(2)
                if (type === 'text' || type === 'textArea') input.fontFamily = input.fontFamily || 'Arial'
                if (type === 'color') input.value = input.value || '#FFFFFF'
                if (type === 'html') input.value = input.value || ''
                input.hidden = input.hidden || false
                if (type !== 'spacer') {
                    if (type === 'range') input.onChange = input.onChange || (() => { })
                    if (input.onChange) addCallback(id, input.onChange, 'change')
                    if (input.onFocusOut) addCallback(id, input.onFocusOut, 'done')
                }
                if (type === 'button' && input.onClick) addCallback(id, input.onClick, 'click')
                const margin = +input.margin
                input.margin = (margin >= 0 || margin < 0) ? margin : 3 // When margin is not set, set default value to 3px
            }

            /** @param {DadoPopupEndorseButton} button */
            const compileButton = button => {
                button.id = button.id || ('b' + genString(12))
                button.text = button.text || 'Ok'
                button.customClass = button.customClass || ''
                button.textColor = button.textColor ? `color: ${button.textColor} !important;` : ''
                button.backgroundColor = button.backgroundColor ? `background-color: ${button.backgroundColor} !important;` : ''
                addCallback(button.id, button.onClick, 'click')
            }

            const call_preConfirm = async preConfirm => {
                try {
                    await delay(10)
                    const values = await readValues()
                    await preConfirm(values)
                    await writeValues(values)
                } catch (e) { console.error(e) }
            }

            const release_callbacks = () => {
                Object.keys(this.___temporaryCallbacks).filter(x => x.startsWith(modal_id)).forEach(key => delete this.___temporaryCallbacks[key])
                delete this.___popupTriggerNext[modal_id]
            }

            const buildKeyboard = keyboard => {
                if (keyboard === 'numpad') return `data - kioskboard - type="numpad"`
                if (keyboard === 'text') return `data - kioskboard - type="keyboard"`
                return ''
            }

            /** @param {DadoPopupInputOption} input * @param {number} index * @returns { String }  */
            const buildInput = (input, index) => {
                compileInput(input) // @ts-ignore
                const { type, id, margin, hidden, customClass } = input
                const input_id = `${modal_id}_${id}`
                const value = type !== 'spacer' && type !== 'password' && type !== 'file' ? input.value : ''
                const placeholder = type === 'text' || type === 'textArea' || type === 'password' || type === 'number' || type === 'color' || type === 'url' || type === 'file' ? input.placeholder : ''
                const C = (customClass || '').split(' ')
                const fontFamily = type === 'text' || type === 'textArea' ? `font-family: ${input.fontFamily};` : ''
                const keyboard = type === 'text' || type === 'date' || type === 'time' || type === 'datetime' || type === 'textArea' || type === 'password' || type === 'number' || type === 'url' ? buildKeyboard(input.keyboard) : ''
                const kbd = buildKeyboard(keyboard)
                if ((type === 'text' || type === 'number' || type === 'password' || type === 'url' || type === 'textArea') && !C.includes(`js-virtual-keyboard`)) C.push('js-virtual-keyboard')
                const CLASS = C.join(' ')
                const color = type === 'spacer' || type === 'button' ? input.color : ''
                const file_type = type === 'file' ? (Array.isArray(input.file_type) ? input.file_type.join(',') : input.file_type) : ''
                const numbered = type === 'dropdown' ? input.numbered : false
                let selected_index = 1
                const dropdown_options = type === 'dropdown' || type === 'dropdown-search' ? (input.options.map((option, i) => `<option value="${option}" ${value === option && (selected_index = i + 1) ? 'selected' : ''}>${numbered ? `${i + 1}. ` : ''}${option}</option>`).join('\n')) : ''
                const min = type === 'range' ? input.min || 0 : 0
                const max = type === 'range' ? input.max || 100 : 100
                const step = type === 'range' ? input.step || 1 : 1
                const isFirst = index === 0
                const callbacks = []
                if (type === 'button') callbacks.push(input.onClick ? ` onclick="DadoPopupClass.call_callback('${input_id}_click')"` : '')
                else if (type !== 'spacer') {
                    const change = input.onChange ? `DadoPopupClass.call_callback('${input_id}_change')` : ''
                    const updateValue = type === 'range' ? `(document.getElementById('${input_id}_value') ? document.getElementById('${input_id}_value').textContent = this.value : true)` : ''
                    const done = input.onFocusOut ? `DadoPopupClass.call_callback('${input_id}_done')` : ''
                    const next = allowEnterKey ? `DadoPopupClass.call_next('${modal_id}')` : ''
                    const keydown = [change, updateValue, next].filter(Boolean).join(';')
                    callbacks.push(` onkeydown="${keydown}"`)
                    callbacks.push(change ? ` onchange="${change}"` : '')
                    callbacks.push(done ? ` onfocusout="${done}"` : '')
                }
                const callback = callbacks.filter(Boolean).join('')
                const label = type !== 'spacer' && input.label ? `<label style="margin-top:${margin}px;">${input.label}:</label>` : `<label class="no-label"></label>`
                const buildInputType = () => {
                    switch (type) {
                        case 'spacer': return `<hr class="dadoPopupSpacer" style="margin: ${margin}px 0 ${margin}px 0; border-top: 2px solid ${color ? color : 'transparent'}" />`;
                        case 'number': return `<input type="number" style="margin-top: ${margin}px;${hidden ? 'display: none;' : ''}" class="dadoPopup-default-input dadoPopupNumber ${input_group_id} ${isFirst ? first_id : ''} ${CLASS}" id="${input_id}" placeholder="${placeholder}" value="${value || ''}" ${kbd} required="true" data-toggle="validator" autocomplete="new-password" ${callback} popup-input />`
                        case 'range': return `<div class="dadoPopup-range-container" style="margin-top: ${margin}px;font-size:16px;"><div id="${input_id}_value" class="dadoPopup-range-value" style="color: var(--dado-black-text) !important;">${value}</div><input type="range" style="${hidden ? 'display: none;' : ''}" class="dadoPopupRange ${input_group_id} ${isFirst ? first_id : ''} ${CLASS}" id="${input_id}" value="${value}" ${kbd} min="${min}" max="${max}" step="${step}" required="true" data-toggle="validator" autocomplete="new-password" ${callback} popup-input /></div>`
                        case 'password': return `<input type="password" style="margin-top: ${margin}px;${hidden ? 'display: none;' : ''}" class="dadoPopup-default-input dadoPopupPassword ${input_group_id} ${isFirst ? first_id : ''} ${CLASS}" id="${input_id}" placeholder="${placeholder}" value="" ${kbd} required="true" data-toggle="validator" autocomplete="new-password" ${callback} popup-input />`
                        case 'boolean': // Obsolete. Use checkbox
                        case 'checkbox': return `<input type="checkbox" style="margin-top: ${margin}px;${hidden ? 'display: none;' : ''}" class="dadoPopup-default-input dadoPopupCheckbox ${input_group_id} ${isFirst ? first_id : ''} ${CLASS}" id="${input_id}" required="true" ${callback} popup-input ${value ? 'checked' : ''}/>`
                        case 'toggle': return `<div style="display:flex;justify-content:left;align-items:center;max-width:800px;"><input type="checkbox" style="margin-top: ${margin}px;${hidden ? 'display: none;' : ''}" class="dadoPopupToggle ${input_group_id} ${isFirst ? first_id : ''} ${CLASS}" id="${input_id}" required="true" ${callback} popup-input ${value ? 'checked' : ''}/></div>`
                        case 'dropdown': return `<select id="${input_id}" style="margin-top: ${margin}px; ${hidden ? 'display: none;' : ''}" class="dadoPopup-default-input dadoPopupDropdown ${input_group_id} ${isFirst ? first_id : ''} ${CLASS}" placeholder="" value="${numbered ? `${selected_index}. ` : ''}${value || ''}" required="true" data-toggle="validator" ${callback}>${dropdown_options}</select>`
                        case 'dropdown-search': return `<input list="dropdownSearchOptions" id="${input_id}" style="margin-top: ${margin}px; ${hidden ? 'display: none;' : ''}" class="dadoPopup-default-input dadoPopupDropdown ${input_group_id} ${isFirst ? first_id : ''} ${CLASS}" value="${numbered ? `${selected_index}. ` : ''}${value || ''}" required="true" data-toggle="validator" ${callback} autocomplete="new-password"><datalist id="dropdownSearchOptions">${dropdown_options}</datalist>`
                        case 'textArea': return `<textarea id="${input_id}" class="dadoPopup-default-input dadoPopupTextArea ${input_group_id} ${isFirst ? first_id : ''} ${CLASS}" style="font-size: 22px !important; ${fontFamily} margin-top: ${margin}px; ${hidden ? 'display: none;' : ''} width:100%; max-width:100%;" rows="${value ? (value + '').split('\n').length : 1}" placeholder="${placeholder}" ${kbd} ${callback}>${value ? value + '' : ''}</textarea>`
                        case 'button': return `<input type="button" id="${input_id}" style="background: ${color ? color : 'var(--dado-secondary)'} !important; margin-top: ${margin}px; ${hidden ? 'display: none;' : ''}" class="dadoPopup-default-input dadoPopupButton ${input_group_id} ${isFirst ? first_id : ''} ${CLASS}" ${callback} value="${value}" autocomplete="new-password"/></input>`
                        case 'color': return `<input type="color" style="margin-top: ${margin}px;${hidden ? 'display: none;' : ''}" class="dadoPopup-default-input dadoPopupColor ${input_group_id} ${isFirst ? first_id : ''} ${CLASS}" id="${input_id}" placeholder="${placeholder}" value="${value || '#FFFFFF'}" required="true" data-toggle="validator" autocomplete="new-password" style="padding: 3px; padding-left: 5px; padding-right: 5px !important;"${callback}>`
                        case 'html': return `<div class="dadoPopupHtml full-label ${CLASS}" id="${input_id}" style="margin-top: ${margin}px;${hidden ? 'display: none;' : ''}">${value}</div>`
                        case 'url': return `<input type="url" class="dadoPopup-default-input dadoPopupURL ${input_group_id} ${isFirst ? first_id : ''} ${CLASS}" id="${input_id}" placeholder="${placeholder}" value="${value || ''}" ${kbd} required="true" data-toggle="validator" autocomplete="new-password" style="margin-top: ${margin}px; ${hidden ? 'display: none;' : ''}" ${callback} popup-input />`
                        case 'file': return `<input type="file" id="${input_id}" style="margin-top: ${margin}px; ${hidden ? 'display: none;' : ''}" class="dadoPopup-default-input dadoPopupFile ${input_group_id} ${isFirst ? first_id : ''} ${CLASS}" ${callback} ${file_type ? `accept="${file_type}"` : ''}/></input>`
                        case 'date': return `<input type="date" class="dadoPopup-default-input dadoPopupDate ${input_group_id} ${isFirst ? first_id : ''} ${CLASS}" id="${input_id}" value="${value || ''}" ${kbd} required="true" data-toggle="validator" style="${fontFamily} margin-top: ${margin}px; ${hidden ? 'display: none;' : ''}" ${callback} popup-input />`
                        case 'time': return `<input type="time" class="dadoPopup-default-input dadoPopupTime ${input_group_id} ${isFirst ? first_id : ''} ${CLASS}" id="${input_id}" value="${value || ''}" ${kbd} required="true" data-toggle="validator" style="${fontFamily} margin-top: ${margin}px; ${hidden ? 'display: none;' : ''}" ${callback} popup-input />`
                        case 'datetime': return `<input type="datetime-local" class="dadoPopup-default-input dadoPopupDateTime ${input_group_id} ${isFirst ? first_id : ''} ${CLASS}" id="${input_id}" value="${value || ''}" ${kbd} required="true" data-toggle="validator" style="${fontFamily} margin-top: ${margin}px; ${hidden ? 'display: none;' : ''}" ${callback} popup-input />`
                        default: return `<input type="text" class="dadoPopup-default-input dadoPopupText ${input_group_id} ${isFirst ? first_id : ''} ${CLASS}" id="${input_id}" placeholder="${placeholder}" value="${value || ''}" ${kbd} required="true" data-toggle="validator" autocomplete="new-password" style="${fontFamily} margin-top: ${margin}px; ${hidden ? 'display: none;' : ''}" ${callback} popup-input />`
                    }
                }
                return (label + buildInputType()).split('\n').map(x => x.trim()).join('')
            }


            /** @param {DadoPopupEndorseButton} button * @param {number} index * @returns { String } */
            const buildEndorseButton = (button, index) => {
                compileButton(button)
                const { id, text, textColor, backgroundColor } = button
                const input_id = `${modal_id}_${id}`
                const callbacks = []
                if (button.onClick) callbacks.push(`onclick="DadoPopupClass.call_callback('${input_id}_click')"`)
                return `<button id="${input_id}" class="dadoPopup-default-input dadoPopupButton no-select ${button.customClass}" style="${textColor} ${backgroundColor}" ${callbacks.join(' ')}>${text}</button>`
            }

            const modalContainer = document.createElement('div')
            modalContainer.id = `${modal_id}-dadoPopup`
            modalContainer.classList.add('dadoPopup-container')
            modalContainer.classList.add('no-select')
            modalContainer.classList.add(style)

            const on_close = async () => {
                if (closeWarning) {
                    const options = typeof closeWarning === 'object' ? closeWarning : {}
                    options.title = options.title || 'Are you sure you want to close this popup?'
                    options.text = options.text || 'All changes will be lost'
                    options.confirmButtonText = options.confirmButtonText || 'Yes'
                    const { title, text, confirmButtonText } = options
                    const result = await this.popup({
                        type: 'form',
                        style,
                        title: `<h2>${title}</h2><p>${text}</p>`,
                        confirmButtonText,
                        backdrop: true,
                    })
                    if (result.status !== 'confirmed') return
                }
                close_modal()
            }
            // @ts-ignore // On backdrop click
            if (backdrop) modalContainer.onclick = e => { if (e.target.classList.contains('dadoPopup-container')) on_close() }

            modalContainer.innerHTML = [
                `<div id="${modal_id}" class="dadoPopup">`,
                `   <div class="dadoPopup-header-bar">`,
                `       <div id="${close_id}" class="dadoPopup-close-button">&times;</div>`,
                `   </div>`,
                `   ${options.title ? `<h1 class="dadoPopup-title no-select">${options.title}</h1>` : ''}`,
                `   <form class="dadoPopup-form">`,
                `       ${inputs.map(buildInput).join('')}`,
                `   </form>`,
                `   <br class="no-select" />`,
                `   <div class="dadoPopup-buttons-container">`,
                `       ${buttons.map(buildEndorseButton).join('')}`,
                `   <div/>`,
                `</div>`,
            ].join('\n')
            document.body.appendChild(modalContainer)
            await delay(10)
            modalContainer.classList.add('shown')
            const modal = document.getElementById(modal_id)
            const header = modal.querySelector('.dadoPopup-header-bar')
            await delay(50)
            if (!modal) return
            switch (options.size) {
                case 'small': modal.classList.add('small'); break
                case 'medium': modal.classList.add('medium'); break
                case 'large': modal.classList.add('large'); break
                case 'extra-large': modal.classList.add('extra-large'); break
                default: break
            }
            await delay(50)

            modalContainer.classList.remove('no-select')
            const draggable = { modal, header, x: 0, y: 0 }
            this.addDraggableDado(draggable)
            const first_input = document.querySelector(`.${first_id}`) // @ts-ignore
            if (first_input) first_input.focus()
            const topCloseButton = document.getElementById(close_id)

            let confirming = false
            const confirm = async (status) => {
                if (confirming) return; else confirming = true
                status = status || 'confirmed'
                this.removeDraggableDado(draggable)
                await call_preConfirm(preConfirm)
                const response = { status }
                if (options.type === 'form') response.data = await readValues(true)
                resolve(response)
                modalContainer.classList.remove('shown')
                await delay(500)
                remove_all_references()
            }
            let closing = false
            const close_modal = async () => {
                if (closing) return; else closing = true
                this.removeDraggableDado(draggable)
                resolve({ status: 'closed' })
                modalContainer.classList.remove('shown')
                await delay(500)
                remove_all_references()
            }
            const on_maximize = () => {
                if (modal.classList.contains('full-screen')) {
                    modal.classList.remove('full-screen')
                    draggable.x = 0
                    draggable.y = 0
                    this.addDraggableDado(draggable)
                } else {
                    this.setTranslate(0, 0, modal)
                    modal.classList.add('full-screen')
                    this.removeDraggableDado(draggable)
                }
            }

            const confirmations = {}
            for (const button of buttons) {
                const { id, status, verify } = button
                confirmations[id] = async () => {
                    if (verify) {
                        const values = await readValues()
                        const verified = await verify(values)
                        if (verified) confirm(status)
                    } else confirm(status)
                }
                const button_element = document.getElementById(`${modal_id}_${id}`)
                if (button_element) button_element.addEventListener('click', confirmations[id])
            }
            topCloseButton.addEventListener('click', on_close)
            header.addEventListener('dblclick', on_maximize)

            const remove_all_references = () => {
                release_callbacks()
                for (const button of buttons) {
                    const { id } = button
                    const button_element = document.getElementById(`${modal_id}_${id}`)
                    if (button_element) button_element.removeEventListener('click', confirmations[id])
                }
                topCloseButton.removeEventListener('click', on_close)
                header.removeEventListener('dblclick', on_maximize)
                modalContainer.remove()
            }
        } catch (e) { reject(e) }
    })
}

const DadoPopupClass = new DADOPOPUP_CLASS()
const DadoPopup = DadoPopupClass.popup