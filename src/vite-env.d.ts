/// <reference types="vite/client" />
interface Document {
    fullScreenElement: any
    mozFullScreen:any
    webkitIsFullScreen: any
    requestFullScreen: () => void
    mozRequestFullScreen: () => void
    webkitRequestFullScreen: () => void
    cancelFullScreen: () => void
    mozCancelFullScreen: () => void
    webkitCancelFullScreen: () => void
}

interface HTMLElement extends Element {
    requestFullScreen: () => void
    mozRequestFullScreen: () => void
    webkitRequestFullScreen: () => void
}
