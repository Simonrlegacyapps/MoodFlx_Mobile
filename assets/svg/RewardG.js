import * as React from "react"
import Svg, { Circle, Path } from 'react-native-svg'

function RewardG({w,h, color}) {
    return (
        <Svg
        width={72}
        height={72}
        viewBox="0 0 72 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        
      >
        <Circle cx={36} cy={36} r={36} fill="#4C5980" />
        <Path
          d="M23.745 34.448v7.87c0 2.881 0 2.881 2.723 4.718l7.49 4.322c1.123.65 2.96.65 4.084 0l7.49-4.322c2.723-1.837 2.723-1.837 2.723-4.718v-7.87c0-2.881 0-2.881-2.724-4.718l-7.489-4.323c-1.124-.649-2.96-.649-4.085 0l-7.489 4.323c-2.723 1.837-2.723 1.837-2.723 4.718z"
          stroke="#fff"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M44.708 29.08v-4.163c0-3.167-1.583-4.75-4.75-4.75h-7.916c-3.167 0-4.75 1.583-4.75 4.75v4.053"
          stroke="#fff"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M36.997 34.4l.903 1.41c.142.222.459.443.697.507l1.614.411c.998.254 1.267 1.109.618 1.9l-1.06 1.283c-.16.206-.286.57-.27.823l.095 1.663c.063 1.029-.665 1.551-1.615 1.171l-1.552-.617a1.366 1.366 0 00-.87 0l-1.552.617c-.95.38-1.678-.158-1.615-1.171l.095-1.663a1.385 1.385 0 00-.27-.823l-1.06-1.283c-.65-.791-.38-1.646.617-1.9l1.615-.411c.254-.064.57-.301.697-.507l.902-1.41c.57-.854 1.457-.854 2.011 0z"
          stroke="#fff"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    )
  }

export default RewardG