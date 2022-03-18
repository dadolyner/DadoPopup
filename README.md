# Best popup library!

# Popup demo
    - https://codepen.io/dadolyner/pen/mdpVYGL

#Popup CDN Files:
    - https://cdn.jsdelivr.net/gh/dadolyner/DadoPopup/DadoPopup.css
    - https://cdn.jsdelivr.net/gh/dadolyner/DadoPopup/DadoPopup.js

# Example
```js
// Parent Popup
const Example = async () => {
    const request = DadoPopup({
        type: 'form',
        style: 'light',
        title: 'Test Form',
        confirmButtonText: 'Confirm',
        size: 'large',
        allowEnterKey: true,
        closeWarning: true,
        inputs: [
            {
                type: 'text',
                label: 'Test Input',
                placeholder: 'Test Input',
                name: 'x',
            },
            {
                type: 'dropdown',
                label: 'Test Select',
                options: ['item1', 'item2', 'item3', 'item4'],
                name: 'y',
            },
            {
                type: 'dropdown-search',
                label: 'Test Searchable Select',
                options: ['item1', 'item2', 'item3', 'item4'],
                name: 'searchDropdown',
            },
            {
                type: 'number',
                label: 'Test Number',
                placeholder: 'Number Test',
                name: 'z',
                onChange: async data => {
                    const { x, y, z } = data
                    x.value = z.value
                    if (x.value > 0) y.hide()
                    else y.show()
                }
            },
            {
                type: 'button',
                label: 'Test Button',
                value: 'Search',
                color: '#2478ff',
                onClick: async values => {
                    const output = await SecondPopupexample(values.x.value, ['A', 'V', 'X', '64'])
                    if (output) values.x.value = output
                }
            },
            {
                type: 'spacer',
                margin: 20,
                color: '#2478ff'
            },
            {
                type: 'boolean',
                label: 'Test Boolean',
                name: 'bool',
                value: true,
            },
            {
                type: 'color',
                label: 'Test Color',
                name: 'color',
                value: '#2478ff',
            },
            {
                type: 'spacer',
                margin: 20,
            },
            {
                type: 'textArea',
                label: 'Test TextArea',
                name: 'textArea',
                value: 'Some random text Some more random text And some more random text',
            },
            {
                type: 'html',
                value: '
                    <h1>Hello World</h1>
                    <p>Testing the world</p>
                ',
            },
            {
                type: 'password',
                label: 'Test Password',
                name: 'password',
            },
            {
                type: 'checkbox',
                label: 'Test Checkbox',
                name: 'checkbox',
                value: true,
            },
            {
                type: 'toggle',
                label: 'Test Toggle',
                name: 'toggle',
                value: true,
            },
            {
                type: 'url',
                label: 'Test URL',
                name: 'url',
                value: "https://www.google.com",
            },
            {
                type: 'file',
                label: 'Test File',
                name: 'file',
            },
            {
                type: 'date',
                label: 'Test Date',
                name: 'date',
                value: '2022-03-03',
            },
            {
                type: 'time',
                label: 'Test Time',
                name: 'time',
                value: '09:39',
            },
            {
                type: 'datetime',
                label: 'Test DateTime',
                name: 'datetime',
                value: '2022-03-03T09:39',
            },
            {
                type: 'range',
                label: 'Test Range',
                name: 'range',
                value: 0,
                min: 0,
                max: 100,
            },
        ]
    })
    const { status, data } = await request
    if (status === 'confirmed') console.log(data)
    else console.log(status)
}

// Child Popup
const SecondPopupexample = async (selected, options) => {
    const request = DadoPopup({
        type: 'form',
        style: 'dark',
        title: 'Select an option',
        confirmButtonText: 'Confirm',
        size: 'medium',
        allowEnterKey: true,
        inputs: [
            {
                type: 'dropdown',
                label: 'Options',
                options,
                name: 'x',
                value: selected
            }
        ]
    })
    const { status, data } = await request
    if (status === 'confirmed')
        return data.x
    return false
}
```
