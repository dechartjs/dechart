import Dechart, { DechartType } from '../dechart';

const dechart = new Dechart({
  chartType: DechartType.LINE,
  componentId: 'componentId',
  data: {},
  options: {},
})
  .on('mousemove', (syntheticData) => {
    this.props.DECHART_handleMouseMove && this.props.DECHART_handleMouseMove(syntheticData);
  })
  .on('mouseout', () => {
    this.props.DECHART_handleMouseOut && this.props.DECHART_handleMouseOut();
  });

console.log('[dechart] instance: %o', dechart);
