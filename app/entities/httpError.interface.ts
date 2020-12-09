import { HttpErrorResponse } from '@angular/common/http';

export interface HttpError {
    title: string;
    reason: string;
    status: number;
}
