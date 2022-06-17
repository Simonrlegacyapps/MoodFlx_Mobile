import * as React from "react"
import Svg, { Path, Rect } from 'react-native-svg'
import Colors from "../../Src/Constants/Colors/Colors"

function Edit({ w, h }) {
    return (
        <Svg
        width={22}
        height={22}
        viewBox="0 0 22 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        
      >
        <Path
          d="M6.947 0h8.106A6.947 6.947 0 0122 6.947v8.106A6.947 6.947 0 0115.053 22H6.947A6.947 6.947 0 010 15.053V6.947A6.947 6.947 0 016.947 0z"
          fill={Colors.blueTextColor}
        />
        <Path
          d="M15.639 8.663l-1.72-1.718a1.254 1.254 0 00-1.668-.044l-5.645 5.645a1.255 1.255 0 00-.358.76l-.27 2.615a.627.627 0 00.628.684h.056l2.616-.239c.286-.028.554-.154.759-.357l5.645-5.646a1.204 1.204 0 00-.043-1.7zm-2.133 2.096l-1.681-1.682 1.223-1.254 1.712 1.712-1.254 1.224z"
          fill="#fff"
        />
      
        </Svg>
    )
}

export default Edit