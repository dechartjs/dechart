function SyntheticEvent({
  bulbX = [],
  bulbY = [],
  clientX = 0,
  clientY = 0,
  selectedData,
  xIdx = 0,
}: SyntheticEventProps) {
  this.bulbX = bulbX;
  this.bulbY = bulbY;
  this.clientX = clientX;
  this.clientY = clientY;
  this.selectedData = selectedData;
  this.xIdx = xIdx;
}

export default SyntheticEvent;

interface SyntheticEventProps {
  bulbX: number[],
  bulbY: number[],
  clientX: number,
  clientY: number,
  selectedData?: any,
  xIdx?: number,
}
