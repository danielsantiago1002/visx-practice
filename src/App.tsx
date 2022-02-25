import React from 'react'
import appleStock, { AppleStock } from '@visx/mock-data/lib/mocks/appleStock'
import useMeasure from 'react-use-measure'
import { scaleBand, scaleLinear } from '@visx/scale'
import { Group } from '@visx/group'
import { AxisLeft, AxisBottom } from '@visx/axis'
import { Bar } from '@visx/shape'
import { defaultStyles, useTooltip, TooltipWithBounds } from '@visx/tooltip'
import { localPoint } from '@visx/event'
import { timeFormat } from 'd3-time-format'


const data = appleStock.slice(0, 20)

const margin = 32

const defaultWidth = 100

const defaultHeight = 100

//define selectors

const getXValue = (d: AppleStock) => d.date

const getYValue = (d: AppleStock) => d.close

const tooltipStyles = {
  ...defaultStyles
}

function App() {

  const [ref, bounds] = useMeasure()

  const {
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0
  } = useTooltip<AppleStock>()

  const width = bounds.width || defaultWidth
  const height = bounds.height || defaultHeight

  const innerWidth = width - margin
  // eslint-disable-next-line no-restricted-globals
  const innerHeigth = height - margin

  const xScale = scaleBand<string>({
    range: [margin, innerWidth],
    domain: data.map(getXValue),
    padding: 0.2,
  })

  const yScale = scaleLinear<number>({
    // eslint-disable-next-line no-restricted-globals
    range: [innerHeigth, margin],
    domain: [
      Math.min(...data.map(getYValue)) - 1,
      Math.max(...data.map(getYValue)) + 1
    ]
  })


  return (
    <>
      <svg ref={ref} width={'100%'} height={'100%'} viewBox={`0 0 ${width} ${height}`} >
        <Group>
          {data.map((d) => {
            const xValue = getXValue(d)
            const barWidth = xScale.bandwidth()
            const barHeight = innerHeigth - (yScale(getYValue(d)) ?? 0)

            const barX = xScale(xValue)
            const barY = innerHeigth - barHeight
            return (
              <Bar
                key={`bar-${xValue}`}
                x={barX}
                y={barY}
                width={barWidth}
                height={barHeight}
                fill={'blue'}
                onMouseMove={(e) => {
                  const point = localPoint(e)

                  if (point) {
                    showTooltip({
                      tooltipData: d,
                      tooltipLeft: point.x,
                      tooltipTop: point.y
                    })
                  }
                  else {
                    return
                  }


                }}

                onMouseLeave={() => hideTooltip()}
              />)

          })}

        </Group>


        <Group>
          <AxisLeft left={margin} scale={yScale} />
        </Group>


        <Group>
          <AxisBottom top={
            // eslint-disable-next-line no-restricted-globals
            innerHeight - margin
          } scale={xScale}
          tickFormat={date => {
            return timeFormat('%B/%d') (new Date(date))
          }}
          
          ></AxisBottom>

        </Group>

      </svg>

      {tooltipData ? (
        <TooltipWithBounds
          key={Math.random()}
          top={tooltipTop}
          left={tooltipLeft}
          style={tooltipStyles}

        >

          <b>{timeFormat('%b %d, %y')(new Date(getXValue(tooltipData)))}</b>: ${getYValue(tooltipData)}

        </TooltipWithBounds >
      ) : null}


    </>
  )
}

export default App
