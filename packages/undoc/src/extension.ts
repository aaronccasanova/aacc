import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext) {
  const updateSelectionDisposable = vscode.commands.registerCommand(
    'undoc.updateSelection',
    updateSelection,
  )

  const copySelectionDisposable = vscode.commands.registerCommand(
    'undoc.copySelection',
    copySelection,
  )

  context.subscriptions.push(updateSelectionDisposable)
  context.subscriptions.push(copySelectionDisposable)
}

function updateSelection() {
  const activeTextEditor = getActiveTextEditor()

  const selection = activeTextEditor.selection
  const selectionText = activeTextEditor.document.getText(selection)

  /** Main selection expanded to capture the 0th column of the first line. */
  const expandedSelection = new vscode.Selection(
    new vscode.Position(selection.start.line, 0),
    selection.end,
  )
  const expandedText = activeTextEditor.document.getText(expandedSelection)

  // https://regex101.com/r/XY3Lf1/1
  const firstCharMatches = expandedText.match(/^[ \t]*\*[ \t]*(?=\S)/gm) ?? []

  /** Min index of the first character from each line in the selection. */
  const minFirstChar = firstCharMatches.reduce(
    (min, line) => Math.min(min, line.length),
    Infinity,
  )

  /** First line index of the selection. */
  const firstLineIndex = selection.start.line

  /** First character index of the first line in the selection. */
  const firstLineCharIndex = selection.start.character

  activeTextEditor.selections = selectionText.split('\n').map((line, index) => {
    const isFirstLine = index === 0
    const currentLineIndex = firstLineIndex + index

    return new vscode.Selection(
      new vscode.Position(
        currentLineIndex,
        isFirstLine ? Math.max(minFirstChar, firstLineCharIndex) : minFirstChar,
      ),
      new vscode.Position(
        currentLineIndex,
        isFirstLine
          ? firstLineCharIndex + line.length
          : Math.max(minFirstChar, line.length),
      ),
    )
  })
}

async function copySelection() {
  const activeTextEditor = getActiveTextEditor()

  updateSelection()

  const text = activeTextEditor.selections
    .map((selection) => activeTextEditor.document.getText(selection))
    .join('\n')

  await vscode.env.clipboard.writeText(text)

  vscode.window.showInformationMessage('Copied selection to clipboard.')
}

function getActiveTextEditor() {
  const activeTextEditor = vscode.window.activeTextEditor

  if (!activeTextEditor) {
    const errorMessage = 'No active text editor in focus.'

    vscode.window.showErrorMessage(errorMessage)
    throw new Error(errorMessage)
  }

  return activeTextEditor
}
