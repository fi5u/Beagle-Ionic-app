import {Directive, ElementRef} from 'angular2/core';

@Directive({
    selector: '[bglAutoFocus]'
})
export class AutoFocusDirective {
    constructor(private elem: ElementRef) {
        window.setTimeout(function() {
            elem.nativeElement.querySelector('input').focus();
        });
    }
}