// Base selectors - properly memoized with createSelector
export const getHeight = createSelector(
  [
    (state: RootState) => state.chartDisplay?.charts ?? {},
    (_, id: string) => id,
  ],
  (charts, id) => charts[id]?.height ?? 0
)

export const getWidth = (state: RootState) => state.chartDisplay?.width || 0

export const getMaxValue = createSelector(
  [
    (state: RootState) => state.chartDisplay?.charts ?? {},
    (_, id: string) => id,
  ],
  (charts, id) => charts[id]?.maxValue ?? 0
)

export const getMinValue = createSelector(
  [
    (state: RootState) => state.chartDisplay?.charts ?? {},
    (_, id: string) => id,
  ],
  (charts, id) => charts[id]?.minValue ?? 0
)

// Base selectors - no ID required
export const getValueAxisWidth = (state: RootState) =>
  state.chartDisplay?.valueAxisWidth ?? 60

export const getMouseCoords = (state: RootState) =>
  state.chartDisplay.mouseCoords

// Computed selectors for chart dimensions - accept ID as second parameter
export const getGraphWidth = createSelector(
  [getValueAxisWidth, getWidth],
  (valueAxisWidth, width) =>
    width - valueAxisWidth > 0 ? width - valueAxisWidth : 0
)

export const getChartArea = createSelector(
  [getValueAxisWidth, getWidth, getHeight],
  (valueAxisWidth, width, height) => ({
    x: valueAxisWidth,
    y: 0,
    width: width - valueAxisWidth,
    height: height,
  })
)

// Computed selectors for chart metrics
export const getCandleWidth = createSelector(
  [getValueAxisWidth, getWidth, getData],
  (valueAxisWidth, width, data) =>
    data.length ? ((width - valueAxisWidth) / data.length) * 0.7 : 0
)

export const getColumnWidth = createSelector(
  [getValueAxisWidth, getWidth, getData],
  (valueAxisWidth, width, data) =>
    data.length ? (width - valueAxisWidth) / data.length : 0
)

// Computed selectors for mouse interaction
export const isMouseOver = createSelector(
  [getMouseCoords],
  (mouseCoords) => mouseCoords.x + mouseCoords.y !== 0
)

export const getCandleIndex = createSelector(
  [getMouseCoords],
  (mouseCoords) => mouseCoords.index
)

export const getMousePosition = createSelector(
  [getMouseCoords],
  (mouseCoords) => ({
    x: mouseCoords.x,
    y: mouseCoords.y,
  })
)
