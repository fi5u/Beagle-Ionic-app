import {Directive, ElementRef} from 'angular2/core';

@Directive({
    selector: '[bglHttpPrefix]'
})
export class HttpPrefixDirective {
    constructor(private elem: ElementRef) {
        elem.nativeElement.addEventListener('keyup', () => {
            const inputValue = elem.nativeElement.querySelector('input').value;
            if (inputValue &&
                (!/^(http):\/\//i.test(inputValue) && !/^(https):\/\//i.test(inputValue)) &&
                ('http://'.indexOf(inputValue) === -1 && 'https://'.indexOf(inputValue) === -1)
            ) {
                elem.nativeElement.querySelector('input').value = 'http://' + inputValue;
            }
        });
    }
}