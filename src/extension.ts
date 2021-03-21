import { commands, Range, window } from 'vscode'

export function activate(): void {
  commands.registerTextEditorCommand('tagger.tag', (textEditor) => {
    window.showInputBox({ placeHolder: 'tag#id.class|attr="value"' }).then((tag) => {
      const { selection, document } = textEditor
      const { start, end } = selection
      const value = document.getText(new Range(start, end))

      const tagMatch = /^([^.|#|\|]*)(#[^\.|\|]*)?(\.[^\|]*)?(\|.*)?/g.exec(tag || '')

      if (!tagMatch || !tagMatch[1]) return window.showErrorMessage('Invalid tag')

      const classArr = (tagMatch[3] && tagMatch[3].split('')) || []

      classArr.shift()

      const tagClass = tagMatch[3]
        ? ` class="${classArr.join('').split('.').join(' ')}"`
        : ''
      const tagId = tagMatch[2] ? ` id="${tagMatch[2].split('#')[1]}"` : ''
      const tagAttrs = tagMatch[4] ? ' ' + tagMatch[4].split('|')[1] : ''

      const formattedTag = `<${tagMatch[1]}${tagId}${tagClass}${tagAttrs}>${value}</${tagMatch[1]}>`

      textEditor.edit((editBuilder) => {
        editBuilder.replace(selection, formattedTag)
      })
    })
  })
}
