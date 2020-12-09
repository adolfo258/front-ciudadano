import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-cuit-increment',
    templateUrl: './cuit-increment.component.html',
    styleUrls: ['./cuit-increment.component.scss']
})
export class CuitIncrementComponent implements OnInit {
    isValedCuil = true;
    constructor() {}

    ngOnInit(): void {}

    validCuild(cuil: string): void {
        const regexCuit = /^(20|23|27|30|33)([0-9]{9}|-[0-9]{8}-[0-9]{1})$/g;
        if (regexCuit.test(cuil)) {
            this.isValedCuil = true;
        } else {
            this.isValedCuil = false;
        }
    }
}
