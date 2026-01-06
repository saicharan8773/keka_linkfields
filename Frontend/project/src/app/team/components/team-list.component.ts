import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeamService } from '../../shared/services/team.service';
import { ToastService } from '../../shared/services/toast.service';
import { Team } from '../../shared/models/team.model';
import { SidebarComponent } from '../../shared/components/sidebar.component';
import { ToastComponent } from '../../shared/components/toast.component';
import { TeamCreateEditComponent } from './team-create-edit.component';
import { TeamDetailsComponent } from './team-details.component';
import { DeleteConfirmationModalComponent } from '../../shared/components/delete-confirmation-modal.component';

@Component({
    selector: 'app-team-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        SidebarComponent,
        ToastComponent,
        TeamCreateEditComponent,
        TeamDetailsComponent,
        DeleteConfirmationModalComponent
    ],
    templateUrl: './team-list.component.html',
    styleUrl: './team-list.component.css',
})
export class TeamListComponent implements OnInit {
    teams: Team[] = [];
    searchText: string = '';
    currentPage: number = 1;
    pageSize: number = 10;
    totalPages: number = 1;

    // Modal states
    showCreateModal: boolean = false;
    showEditModal: boolean = false;
    showDetailsModal: boolean = false;
    showDeleteModal: boolean = false;

    selectedTeamId: string = '';
    selectedTeam: Team | null = null;
    teamToDelete: string = '';
    isDeleting: boolean = false;

    // Loading state
    isLoading: boolean = false;

    constructor(
        private teamService: TeamService,
        private toastService: ToastService
    ) { }

    ngOnInit(): void {
        this.loadTeams();
    }

    /**
     * Load teams from API
     */
    loadTeams(): void {
        this.isLoading = true;
        const filters = {
            query: this.searchText,
            page: this.currentPage,
            pageSize: this.pageSize,
        };

        this.teamService.getAllTeams(filters).subscribe({
            next: (teams) => {
                this.teams = teams;
                this.calculateTotalPages();
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error loading teams:', error);
                this.toastService.error('Failed to load teams');
                this.isLoading = false;
            },
        });
    }

    /**
     * Search teams
     */
    onSearch(): void {
        this.currentPage = 1;
        this.loadTeams();
    }

    /**
     * Calculate total pages for pagination
     */
    calculateTotalPages(): void {
        this.totalPages = Math.max(1, Math.ceil(this.teams.length / this.pageSize));
    }

    /**
     * Get serial number for table row
     */
    getSerialNumber(index: number): number {
        return (this.currentPage - 1) * this.pageSize + index + 1;
    }

    /**
     * Handle page change
     */
    onPageChange(page: number): void {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            this.loadTeams();
        }
    }

    /**
     * Open create team modal
     */
    openCreateModal(): void {
        this.selectedTeam = null;
        this.showCreateModal = true;
    }

    /**
     * Open edit team modal
     */
    openEditModal(team: Team): void {
        this.selectedTeam = team;
        this.selectedTeamId = team.id;
        this.showEditModal = true;
    }

    /**
     * Open team details modal
     */
    openDetailsModal(teamId: string): void {
        this.selectedTeamId = teamId;
        this.showDetailsModal = true;
    }

    /**
     * Handle team created
     */
    onTeamCreated(): void {
        this.showCreateModal = false;
        this.loadTeams();
        this.toastService.success('Team created successfully');
    }

    /**
     * Handle team updated
     */
    onTeamUpdated(): void {
        this.showEditModal = false;
        this.loadTeams();
        this.toastService.success('Team updated successfully');
    }

    /**
     * Open delete confirmation modal
     */
    onDelete(teamId: string): void {
        this.teamToDelete = teamId;
        this.showDeleteModal = true;
    }

    /**
     * Confirm delete team
     */
    confirmDelete(): void {
        this.isDeleting = true;
        this.teamService.deleteTeam(this.teamToDelete).subscribe({
            next: () => {
                this.toastService.success('Team deleted successfully');
                this.showDeleteModal = false;
                this.isDeleting = false;
                this.loadTeams();
            },
            error: (error) => {
                console.error('Error deleting team:', error);
                const errorMessage = error.error?.message ||
                    error.error?.title ||
                    'Failed to delete team. The team may have employees assigned.';
                this.toastService.error(errorMessage);
                this.isDeleting = false;
            },
        });
    }

    /**
     * Cancel delete
     */
    cancelDelete(): void {
        this.showDeleteModal = false;
        this.teamToDelete = '';
    }

    /**
     * Close modals
     */
    closeCreateModal(): void {
        this.showCreateModal = false;
    }

    closeEditModal(): void {
        this.showEditModal = false;
    }

    closeDetailsModal(): void {
        this.showDetailsModal = false;
    }
}
