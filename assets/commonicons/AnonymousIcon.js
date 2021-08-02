import * as React from "react"
import Svg, { Circle, Path } from "react-native-svg"

const AnonymousIcon = (props) => {
    return (
        <Svg
            width={props?.width ?? 22}
            height={props?.height ?? 19}
            viewBox="0 0 22 19"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <Circle cx={5.5} cy={14.5} r={3.5} stroke="#fff" strokeWidth={2} />
            <Circle cx={16.5} cy={14.5} r={3.5} stroke="#fff" strokeWidth={2} />
            <Path d="M9 14h4" stroke="#fff" strokeWidth={2} />
            <Path
                d="M1 7a1 1 0 000 2V7zm20 2a1 1 0 100-2v2zm-4.187-6.605l.953-.303-.953.303zM5.025 2.44l-.96-.28.96.28zM1 9h2.407V7H1v2zm3.368-.72l1.617-5.56-1.92-.558L2.447 7.72l1.92.558zM6.945 2h7.962V0H6.945v2zM3.407 9h15.186V7H3.407v2zm15.186 0H21V7h-2.407v2zM15.86 2.697l1.78 5.606 1.906-.606-1.78-5.605-1.906.605zM14.907 2a1 1 0 01.953.697l1.906-.605A3 3 0 0014.906 0v2zm-8.922.72a1 1 0 01.96-.72V0a3 3 0 00-2.88 2.162l1.92.559z"
                fill="#fff"
            />
        </Svg>
    )
}

export default AnonymousIcon