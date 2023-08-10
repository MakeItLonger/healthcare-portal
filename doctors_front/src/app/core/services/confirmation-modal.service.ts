import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationModalComponent } from 'src/app/shared/confirmation-modal/confirmation-modal.component';

@Injectable({
  providedIn: 'root',
})
export class ConfirmationModalService {
  constructor(private dialog: MatDialog) {}

  openConfirmationModal(message: string): Promise<boolean> {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: '400px',
      data: { message },
    });

    return dialogRef.afterClosed().toPromise();
  }
}
