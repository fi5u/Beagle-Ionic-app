import {Directive, ElementRef, ViewChildren} from 'angular2/core';

@Directive({
    selector: '[bglAutoFocus]'
})
export class AutoFocusDirective {
    constructor(private elem: ElementRef) {
        this.elem = elem;
    }
    ngAfterViewInit() {
        this.elem.nativeElement.querySelector('input').focus();
    }
}