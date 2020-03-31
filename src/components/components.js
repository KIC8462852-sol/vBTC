import React from 'react'
import { Button as AntButton } from "antd"

export const H1 = (props) => {
  let styles = {...props.style || {}}
  styles.fontSize = "24px"
  styles.fontWeight = "bold"
  styles.color = "#111122"

    if (props.margin) {
    styles.margin = props.margin
  }

  return (
    <span style={styles}>
      {props.children}
    </span>
  )
}

export const H2 = (props) => {
  let styles = {...props.style || {}}
  styles.fontSize = "20px"
  styles.fontWeight = "bold"
  styles.color = "#111122"
  styles.margin = "20px 0px"

  if (props.margin) {
    styles.margin = props.margin
  }
  return (
    <span style={styles}>
      {props.children}
    </span>
  )
}

export const Subtitle = (props) => {
  let styles = {...props.style || {}}
  styles.fontSize = "14px"
  styles.fontWeight = "bold"
  styles.color = "#111122"
  styles.margin = "20px 0px"

  if (props.margin) {
    styles.margin = props.margin
  }
  return (
    <span style={styles}>
      {props.children}
    </span>
  )
}


export const Label = (props) => {
  let styles = {...props.style || {}}
  styles.fontSize = "16px"
  styles.fontWeight = "bold"
  styles.color = "#111122"
  styles.margin = "20px 0px"

    if (props.margin) {
    styles.margin = props.margin
  }

  return (
    <span style={styles}>
      {props.children}
    </span>
  )
}

export const LabelGrey = (props) => {
  let styles = {...props.style || {}}
  styles.fontSize = "16px"
  styles.fontWeight = "bold"
  styles.color = "#8e9097"
  styles.margin = "20px 0px"

    if (props.margin) {
    styles.margin = props.margin
  }

  return (
    <span style={styles}>
      {props.children}
    </span>
  )
}

export const Sublabel = (props) => {
  let styles = {...props.style || {}}
  styles.fontSize = "14px"
  styles.fontWeight = ""
  styles.color = "#111122"
  styles.margin = "20px 0px"

    if (props.margin) {
    styles.margin = props.margin
  }

  return (
    <span style={styles}>
      {props.children}
    </span>
  )
}

export const Text = (props) => {
  let styles = {...props.style || {}}
  styles.fontSize = "14px"
  styles.color = "#000000"
  styles.margin = "20px 0px"

  if (props.bold) {
    styles.fontWeight = "bold"
  }
  if (props.color) {
    styles.color = props.color
  }
  if (props.size) {
    styles.fontSize = props.size
  }
  if (props.margin) {
    styles.margin = props.margin
  }
  return (
    <span style={styles}>
      {props.children}
    </span>
  )
}

export const P = (props) => {
  let styles = {...props.style || {}}
  styles.fontSize = "12px"
  styles.color = "#111122"
  styles.display = "block"
  styles.fontWeight = "bold"
  styles.display = "flex"
  styles.alignItems = "center"
  styles.justifyContent = "center"
  // styles.marginLeft = -80
  return (
    <span style={styles}>
      {props.children}
    </span>
  )
}

export const Click = (props) => {
  let styles = {...props.style || {}}
  styles.fontSize = "16px"
  styles.fontWeight = "bold"
  styles.color = "#000061"
  styles.textDecoration = "underline"
  styles.marginTop = 30
  styles.marginBottom = 30
  styles.margin = "20px 0px"
  return (
    <span style={styles}>
      {props.children}
    </span>
  )
}

export const Button = (props) => {
  let styles = {...props.style || {}}
  styles.fontSize = "16px"
  styles.fontWeight = "bold"
  styles.color = "#000061"
  styles.textDecoration = "underline"
  styles.marginTop = 30
  styles.marginBottom = 30
  styles.margin = "0px 0px"
  styles.backgroundColor = "#fff"
  styles.borderColor = "#fff"
  styles.display= "inline-block"
  styles.borderBottom = "1px solid #000061"
  styles.height = "20px"
  styles.padding = "0px 0px"

  return (
    <AntButton
      disabled={props.disabled}
      style={styles}
      onClick={props.onClick}
      onChange={props.onChange}
      type={props.type}
      loading={props.loading}
    >
      {props.children}
    </AntButton>
  )
}


export const Center = (props) => (
  <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
    {props.children}
  </div>
)

export const HR = () => (
  <div>
    <hr style={{marginTop:40, marginRight:0}}/>
  </div>
)

export const Gap = () => (
  <div>
    <br></br><br></br>
  </div>
)
