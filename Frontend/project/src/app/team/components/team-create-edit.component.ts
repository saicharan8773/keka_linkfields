import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TeamService } from '../../shared/services/team.service';
import { ToastService } from '../../shared/services/toast.service';
import { Team, TeamCreatePayload, TeamUpdatePayload } from '../../shared/models/team.model';

@Component({
    selector: 'app-team-create-edit',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './team-create-edit.component.html',
    styleUrl: './team-create-edit.component.css',
})
export class TeamCreateEditComponent implements OnInit {
    @Input() team: Team | null = null;
    @Output() closeModal = new EventEmitter<void>();
    @Output() teamSaved = new EventEmitter<void>();

    teamForm!: FormGroup;
    isEditMode: boolean = false;
    isSaving: boolean = false;

    constructor(
        private fb: FormBuilder,
        private teamService: TeamService,
        private toastService: ToastService
    ) { }

    ngOnInit(): void {
        this.isEditMode = !!this.team;
        this.initializeForm();
    }

    /**
     * Initialize form with validation
     */
    initializeForm(): void {
        this.teamForm = this.fb.group({
            name: [
                this.team?.name || '',
                [Validators.required, Validators.minLength(2), Validators.maxLength(100)]
            ],
            description: [this.team?.description || '', [Validators.maxLength(500)]],
        });
    }

    /**
     * Get form control for validation
     */
    get f() {
        return this.teamForm.controls;
    }

    /**
     * Submit form
     */
    onSubmit(): void {
        if (this.teamForm.invalid) {
            this.teamForm.markAllAsTouched();
            return;
        }

        this.isSaving = true;

        if (this.isEditMode && this.team) {
            this.updateTeam();
        } else {
            this.createTeam();
        }
    }

    /**
     * Create new team
     */
    createTeam(): void {
        const payload: TeamCreatePayload = {
            name: this.teamForm.value.name.trim(),
            description: this.teamForm.value.description?.trim() || null,
        };

        this.teamService.createTeam(payload).subscribe({
            next: () => {
                this.isSaving = false;
                this.teamSaved.emit();
            },
            error: (error) => {
                console.error('Error creating team:', error);
                this.toastService.error(
                    error.error?.message || 'Failed to create team'
                );
                this.isSaving = false;
            },
        });
    }

    /**
     * Update existing team
     */
    updateTeam(): void {
        const payload: TeamUpdatePayload = {
            name: this.teamForm.value.name.trim(),
            description: this.teamForm.value.description?.trim() || null,
        };

        this.teamService.updateTeam(this.team!.id, payload).subscribe({
            next: () => {
                this.isSaving = false;
                this.teamSaved.emit();
            },
            error: (error) => {
                console.error('Error updating team:', error);
                this.toastService.error(
                    error.error?.message || 'Failed to update team'
                );
                this.isSaving = false;
            },
        });
    }

    /**
     * Close modal
     */
    onClose(): void {
        this.closeModal.emit();
    }
}
