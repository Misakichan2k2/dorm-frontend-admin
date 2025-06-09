import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";

import { BarChart, PieChart } from "echarts/charts";

import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  AxisPointerComponent,
} from "echarts/components";

echarts.use([
  CanvasRenderer,
  BarChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  AxisPointerComponent,
]);

export default echarts;
