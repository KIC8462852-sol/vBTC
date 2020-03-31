import React from 'react'

import { Links } from './content'

var style = { 
    backgroundColor: "#e3e5ea",
    textAlign: "left",
    padding: "20px",
    position: "fixed",
    left: "0",
    bottom: "0",
    height: "60px",
    width: "100%",
}

var phantom = {
  display: 'block',
  padding: '20px',
  height: '60px',
  width: '100%',
}

function Footer() {
    return (
        <div>
            <div style={phantom} />
            <div style={style}>
                <Links/>
            </div>
        </div>
    )
}

export default Footer