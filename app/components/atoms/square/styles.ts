export const squareStyles = {
  container: 'w-full h-full border border-gray-300 rounded shadow-md flex flex-col items-center justify-center p-2 relative transform-none',
  icon: 'absolute top-1.5 left-1.5',
  iconClickable: 'cursor-pointer',
  addIconButton: 'absolute top-1.5 left-1.5 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer',
  addIconSvg: 'w-4 h-4 text-gray-500',
  colorIndicator: 'absolute top-1.5 right-1.5 flex items-center',
  colorDot: 'w-3 h-3 rounded-full border border-gray-300',
  contentContainer: 'w-full h-full flex items-center justify-center',
  input: 'w-auto max-w-full text-center focus:outline-none bg-transparent px-2 py-1 pointer-events-auto',
  text: 'text-center w-auto max-w-full overflow-hidden text-black px-2 py-1 pointer-events-none',
};

export const colorPickerStyles = {
  preview: 'mb-6 flex flex-col items-center',
  previewColor: 'w-24 h-24 rounded-lg shadow-md border border-gray-200 mb-2',
  colorValue: 'text-sm font-mono',
  section: 'mb-6',
  label: 'block text-sm font-medium text-gray-700 mb-2',
  colorInputContainer: 'flex items-center gap-4',
  colorInput: 'h-10 w-10 border-0 p-0 cursor-pointer',
  hexInput: 'flex-1 border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none',
  colorsGrid: 'grid grid-cols-5 gap-2',
  colorButton: 'w-full aspect-square rounded-md border',
  colorButtonSelected: 'border-2 border-blue-500',
  colorButtonHover: '',
  cancelButton: 'px-4 py-2 bg-gray-200 text-gray-800 rounded-md',
  applyButton: 'px-4 py-2 bg-blue-600 text-white rounded-md',
}; 