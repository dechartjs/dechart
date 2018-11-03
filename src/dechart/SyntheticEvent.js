export default function SyntheticEvent({
  bulbX = [],
  bulbY = [],
  clientX = 0,
  clientY = 0,
  selectedData,
  xIdx = 0,
}) {
  this.bulbX = bulbX;
  this.bulbY = bulbY;
  this.clientX = clientX;
  this.clientY = clientY;
  this.selectedData = selectedData;
  this.xIdx = xIdx;
}
