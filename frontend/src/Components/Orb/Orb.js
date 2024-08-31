import React from "react";
import styled from "styled-components";
import { useWindowSize } from "../../utils/useWindowSize";

const OrbStyled = styled.div`
    width: 70vh;
    height: 70vh;
    position: absolute;
    border-radius: 50%;
    margin-left: -35vh;
    margin-top: -35vh;
    background: linear-gradient(180deg, #F56692 0%, #F2994A 100%);
    filter: blur(400px);
    animation: ${({ width, height }) => `
        moveOrb 15s alternate linear infinite
    `};
    @keyframes moveOrb {
        0% {
            transform: translate(0, 0);
        }
        50% {
            transform: translate(${({ width }) => width}px, ${({ height }) => height}px);
        }
        100% {
            transform: translate(0, 0);
        }
    }
`;

function Orb() {
    const { width, height } = useWindowSize();

    return <OrbStyled width={width} height={height} />;
}

export default Orb;
