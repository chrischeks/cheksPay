import { AfterViewChecked, EventEmitter, OnInit, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';
import { ControlValueAccessor, FormControl } from '@angular/forms';
import { MdbCompleterDirective } from '../directives/completer.directive';
import { CompleterData } from '../services/completer-data.service';
import { CompleterService } from '../services/completer.service';
import { CompleterItem } from './completer-item.component';
export declare class CompleterComponent implements OnInit, ControlValueAccessor, AfterViewChecked, AfterViewInit {
    private completerService;
    private renderer;
    private el;
    dataService: CompleterData;
    inputName: string;
    inputId: string;
    pause: number;
    minSearchLength: number;
    maxChars: number;
    overrideSuggested: boolean;
    clearSelected: boolean;
    clearUnselected: boolean;
    fillHighlighted: boolean;
    placeholder: string;
    matchClass: string;
    fieldTabindex: number;
    clearButtonTabIndex: number;
    autoMatch: boolean;
    disableInput: boolean;
    inputClass: string;
    autofocus: boolean;
    openOnFocus: boolean;
    initialValue: any;
    autoHighlight: boolean;
    label: string;
    datasource: CompleterData | string | Array<any>;
    textNoResults: string;
    textSearching: string;
    selected: EventEmitter<CompleterItem>;
    highlighted: EventEmitter<CompleterItem>;
    blur: EventEmitter<{}>;
    focusEvent: EventEmitter<{}>;
    opened: EventEmitter<boolean>;
    keyup: EventEmitter<any>;
    keydown: EventEmitter<any>;
    completer: MdbCompleterDirective;
    mdbInput: ElementRef;
    labelEl: ElementRef;
    focused: boolean;
    state: string;
    searchStr: string;
    control: FormControl;
    displaySearching: any;
    displayNoResults: any;
    _onTouchedCallback: () => void;
    _onChangeCallback: (_: any) => void;
    _focus: boolean;
    _open: boolean;
    _textNoResults: string;
    _textSearching: string;
    constructor(completerService: CompleterService, renderer: Renderer2, el: ElementRef);
    onkeyup(event: any): void;
    onclick(event: any): void;
    onFocusIn(): void;
    onFocusOut(): void;
    activateClearButton(event: any): void;
    triggerClearButtonAnimation(buttonState: string): void;
    value: any;
    ngAfterViewInit(): void;
    ngAfterViewChecked(): void;
    onTouched(): void;
    writeValue(value: any): void;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
    ngOnInit(): void;
    onBlur(): void;
    onFocus(): void;
    onChange(value: string): void;
    open(): void;
    close(): void;
    focus(): void;
    isOpen(): boolean;
}
