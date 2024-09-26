import { css } from "@emotion/react"

export const slidebarCss = css`
  .ant-menu {
    border-inline-end: none !important;
    background-color: transparent !important;
    .ant-menu-submenu-arrow {
      display: none;
    }
  }
  .ant-menu-item {
    &:hover, &.ant-menu-item-selected, ant-menu-item-active {
      color: #e5002b !important;
      background-color: #ffe6ea;
    }
  }
`
