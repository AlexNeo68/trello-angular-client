import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-inline-form',
  templateUrl: './inline-form.component.html',
  styleUrls: ['./inline-form.component.scss'],
})
export class InlineFormComponent {
  @Input() title: string = '';
  @Input() defaultText: string = 'Not defined';
  @Input() placeholderText: string = '';
  @Input() hasButton: boolean = false;
  @Input() buttonText: string = '';
  @Input() inputType: string = 'input';

  @Output() handleSubmit = new EventEmitter<string>();

  constructor(private fb: FormBuilder) {}

  form = this.fb.group({
    title: ['', [Validators.required]],
  });

  isEditing = false;

  setEditing(): void {
    this.isEditing = true;
    if (this.title) {
      this.form.patchValue({ title: this.title });
    }
  }

  onSubmit(): void {
    if (this.form.value.title) {
      this.handleSubmit.emit(this.form.value.title);
      this.isEditing = false;
      this.form.reset();
    }
  }
}
