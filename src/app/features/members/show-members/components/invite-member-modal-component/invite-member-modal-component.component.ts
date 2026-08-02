import { Component, OnDestroy, inject, input, output } from '@angular/core';
import { ClickOutsideDirective } from '../../../../../core/components/click-outside.directive';
import { FormFieldComponent } from '../../../../auth/components/form-field/form-field.component';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { emailValidator } from '../../../../../shared/utils';
import { MembersFacade } from '../../../facade/members.facade';
import { Subject, takeUntil } from 'rxjs';
import { ToastService } from '../../../../../shared/service/toast.service';

@Component({
  selector: 'app-invite-member-modal-component',
  standalone: true,
  imports: [ClickOutsideDirective, FormFieldComponent],
  templateUrl: './invite-member-modal-component.component.html',
})
export class InviteMemberModalComponent implements OnDestroy {
  projectId = input<string>('');
  closeModalOutput = output<boolean>();
  membersFacade = inject(MembersFacade);
  destroy$ = new Subject<void>();
  formBuilder = inject(FormBuilder);
  formGroup = this.formBuilder.group({
    email: ['', [Validators.required, emailValidator()]],
  });
  toastService = inject(ToastService);

  getFormControl(name: string) {
    return this.formGroup.get(name) as FormControl;
  }

  close() {
    this.closeModalOutput.emit(false);
  }

  inviteMember() {
    this.membersFacade
      .sendProjectInvitation(this.projectId(), this.getFormControl('email').value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastService.success('Invitation sent successfully');
          this.close();
        },
        error: () => {
          this.close();
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
