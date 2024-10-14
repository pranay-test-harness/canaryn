import { BlameItem } from '../types/blame'
import { escapeSingleQuote } from './utils'

export function getMonacoEditorCss({
  instanceId,
  lineNumbersPosition
}: {
  instanceId: string
  lineNumbersPosition: 'left' | 'center'
}) {
  let css = ''

  // we move '.margin' element and update left/width of monaco editor
  if (lineNumbersPosition === 'center') {
    css += `
      .monaco-editor-${instanceId} .monaco-scrollable-element.editor-scrollable {
          width: 100% !important;
          left: 0px !important;
      }

      .monaco-editor-${instanceId} .view-lines, .view-zones {
          width: 100% !important;
      }
      
      .monaco-editor-${instanceId} .margin {
        z-index: 1000;
        background: transparent !important;
      }`
  }

  css += `
      .monaco-editor-${instanceId} .blame-editor-separator {
        right: 14px;
      }

      .monaco-editor-${instanceId} {
        outline: none !important;
      }
      
      .monaco-editor-${instanceId} .view-line .blame-editor-commit {
        display: inline-block;
        color: white;
      }`

  return css
}

export function getMonacoEditorCommitCss({
  instanceId,
  blameData,
  dateWidth,
  avatarSize
}: {
  instanceId: string
  blameData: BlameItem[]
  dateWidth: number
  avatarSize: number
}) {
  blameData

  let css = ''
  blameData.forEach(blameItem => {
    for (let lineNo = blameItem.fromLineNumber; lineNo <= blameItem.toLineNumber; lineNo++) {
      if (lineNo === blameItem.fromLineNumber) {
        css += `
          .monaco-editor-${instanceId} .view-line .blame-editor-commit-${lineNo}:before {
            content: '${escapeSingleQuote(blameItem.commitInfo.author.when)}';
            position: absolute;
            left: 10px;
            top: 0px;
            color: gray;
          }

          .monaco-editor-${instanceId} .view-line .blame-editor-commit-${lineNo}:after {
            content: ' ';
            position: absolute;
            left: ${dateWidth + avatarSize}px;
            top: 1px;
            color: gray;
            width: ${avatarSize}px;
            height: ${avatarSize}px;
            background: url('${blameItem.commitInfo.author.avatarUrl}');
            background-size: 100% 100%;
          }`
      } else {
        css += `
          .monaco-editor-${instanceId} .view-line .blame-editor-commit-${lineNo}:before {
            content: ' ';
            left: 10px;
            top: 0px;
            color: gray;
          }`
      }
    }
  })

  return css
}

export function createCommitMessage(msg: string, commitMsgLength: number) {
  let ret = ''
  if (msg.length > commitMsgLength) {
    ret = msg.slice(0, commitMsgLength - 3) + '...'
  } else if (msg.length < commitMsgLength) {
    ret = msg + ' '.repeat(commitMsgLength - msg.length)
  } else {
    ret = msg
  }

  return ' '.repeat(25) + ret + ' '.repeat(10)
}