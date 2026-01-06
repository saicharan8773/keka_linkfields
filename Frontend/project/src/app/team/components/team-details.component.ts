import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeamService } from '../../shared/services/team.service';
import { ToastService } from '../../shared/services/toast.service';
import { Team, TeamEmployee } from '../../shared/models/team.model';

@Component({
    selector: 'app-team-details',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './team-details.component.html',
    styleUrl: './team-details.component.css',
})
export class TeamDetailsComponent implements OnInit {
    @Input() teamId!: string;
    @Output() closeModal = new EventEmitter<void>();
    @Output() editTeam = new EventEmitter<Team>();

    team: Team | null = null;
    teamEmployees: TeamEmployee[] = [];
    availableEmployees: TeamEmployee[] = [];

    isLoading: boolean = false;
    isLoadingEmployees: boolean = false;
    isAssigning: boolean = false;
    isRemoving: boolean = false;

    showAssignModal: boolean = false;
    selectedEmployeeId: string = '';
    employeeToRemove: string = '';
    showRemoveConfirm: boolean = false;

    constructor(
        private teamService: TeamService,
        private toastService: ToastService
    ) { }

    ngOnInit(): void {
        this.loadTeamDetails();
        this.loadTeamEmployees();
    }

    /**
     * Load team details
     */
    loadTeamDetails(): void {
        this.isLoading = true;
        this.teamService.getTeamById(this.teamId).subscribe({
            next: (team) => {
                this.team = team;
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error loading team:', error);
                this.toastService.error('Failed to load team details');
                this.isLoading = false;
            },
        });
    }

    /**
     * Load team employees
     */
    loadTeamEmployees(): void {
        this.isLoadingEmployees = true;
        this.teamService.getTeamEmployees(this.teamId).subscribe({
            next: (employees) => {
                this.teamEmployees = employees;
                this.isLoadingEmployees = false;
            },
            error: (error) => {
                console.error('Error loading team employees:', error);
                this.toastService.error('Failed to load team employees');
                this.isLoadingEmployees = false;
            },
        });
    }

    /**
     * Load available employees (without team)
     */
    loadAvailableEmployees(): void {
        this.teamService.getEmployeesWithoutTeam().subscribe({
            next: (employees) => {
                this.availableEmployees = employees;
            },
            error: (error) => {
                console.error('Error loading available employees:', error);
                this.toastService.error('Failed to load available employees');
            },
        });
    }

    /**
     * Open assign employee modal
     */
    openAssignModal(): void {
        this.loadAvailableEmployees();
        this.showAssignModal = true;
    }

    /**
     * Assign employee to team
     */
    assignEmployee(): void {
        if (!this.selectedEmployeeId) {
            this.toastService.error('Please select an employee');
            return;
        }

        this.isAssigning = true;
        this.teamService
            .assignEmployeeToTeam(this.selectedEmployeeId, { teamId: this.teamId })
            .subscribe({
                next: () => {
                    this.toastService.success('Employee assigned successfully');
                    this.showAssignModal = false;
                    this.selectedEmployeeId = '';
                    this.isAssigning = false;
                    this.loadTeamEmployees();
                    this.loadTeamDetails(); // Refresh employee count
                },
                error: (error) => {
                    console.error('Error assigning employee:', error);
                    this.toastService.error(
                        error.error?.message || 'Failed to assign employee'
                    );
                    this.isAssigning = false;
                },
            });
    }

    /**
     * Open remove confirmation
     */
    confirmRemoveEmployee(employeeId: string): void {
        this.employeeToRemove = employeeId;
        this.showRemoveConfirm = true;
    }

    /**
     * Remove employee from team
     */
    removeEmployee(): void {
        this.isRemoving = true;
        this.teamService.removeEmployeeFromTeam(this.employeeToRemove).subscribe({
            next: () => {
                this.toastService.success('Employee removed from team');
                this.showRemoveConfirm = false;
                this.employeeToRemove = '';
                this.isRemoving = false;
                this.loadTeamEmployees();
                this.loadTeamDetails(); // Refresh employee count
            },
            error: (error) => {
                console.error('Error removing employee:', error);
                this.toastService.error(
                    error.error?.message || 'Failed to remove employee'
                );
                this.isRemoving = false;
            },
        });
    }

    /**
     * Cancel remove
     */
    cancelRemove(): void {
        this.showRemoveConfirm = false;
        this.employeeToRemove = '';
    }

    /**
     * Close assign modal
     */
    closeAssignModal(): void {
        this.showAssignModal = false;
        this.selectedEmployeeId = '';
    }

    /**
     * Edit team
     */
    onEdit(): void {
        if (this.team) {
            this.editTeam.emit(this.team);
            this.closeModal.emit();
        }
    }

    /**
     * Close modal
     */
    onClose(): void {
        this.closeModal.emit();
    }
}
