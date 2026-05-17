import useChartDimensions from "../use-chart-dimensions"

export type LegendProps = {
  label: string
  value: number
}

export default function Legend
  ({ label, value }: LegendProps) {
    const { state: { valueAxisWidth } } = useChartDimensions()
    return (
      <g>
        <rect
          className="fill-foreground"
          height={20}
          width={valueAxisWidth}
          x={0}
          y={value - 10}
        />
        <text
          className="fill-indigo-900 [text-anchor:middle] select-none text-[9px]"
          x={valueAxisWidth / 2}
          y={value + 3}
        >
          {label}
        </text>
      </g>
    )
  }