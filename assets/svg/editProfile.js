import * as React from "react"
import Svg, { Path, Rect } from 'react-native-svg'

function EditProfile({ w, h }) {
    return (
        <Svg
            width={w?w:36}
            height={h?h:34}
            viewBox="0 0 36 34"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <Rect width={36} height={34} rx={8} fill="#E4DFFF" />
            <Path
                d="M24.358 13.81l-2.17-2.168a1.583 1.583 0 00-2.105-.056l-7.125 7.125a1.583 1.583 0 00-.451.958l-.34 3.301a.79.79 0 00.791.863h.071l3.302-.3c.361-.037.7-.196.957-.452l7.125-7.125a1.52 1.52 0 00-.055-2.145zm-2.692 2.645l-2.121-2.122 1.543-1.583 2.162 2.161-1.584 1.544z"
                fill="#7265E3"
            />
        </Svg>
    )
}

export default EditProfile