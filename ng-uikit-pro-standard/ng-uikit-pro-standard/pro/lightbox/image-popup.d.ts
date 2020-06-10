import { ElementRef, EventEmitter, OnInit, Renderer2 } from '@angular/core';
import 'hammerjs';
export declare class ImageModalComponent implements OnInit {
    element: ElementRef;
    renderer: Renderer2;
    _element: any;
    opened: boolean;
    imgSrc: string;
    currentImageIndex: number;
    loading: boolean;
    showRepeat: boolean;
    isMobile: boolean;
    openModalWindow: any;
    clicked: any;
    isBrowser: any;
    zoomed: string;
    SWIPE_ACTION: {
        LEFT: string;
        RIGHT: string;
    };
    modalImages: any;
    imagePointer: number;
    fullscreen: boolean;
    zoom: boolean;
    smooth: boolean;
    type: String;
    cancelEvent: EventEmitter<any>;
    constructor(platformId: string, element: ElementRef, renderer: Renderer2);
    toggleZoomed(): void;
    toggleRestart(): void;
    ngOnInit(): void;
    closeGallery(): void;
    prevImage(): void;
    nextImage(): void;
    openGallery(index: any): void;
    fullScreen(): any;
    readonly is_iPhone_or_iPod: boolean;
    keyboardControl(event: KeyboardEvent): void;
    swipe(action?: String): void;
}
