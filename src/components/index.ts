// Atomic Design Structure - explicit exports to avoid conflicts
export * from './atoms';
export * from './templates';
export * from './layouts';

// Molecules (with specific exports to avoid conflicts)
export { 
  PageHeader,
  ErrorResult,
  InfoCard,
  RoomEditModal,
  AddResidentModal,
  AddMaintenanceModal,
  AddUtilityModal,
  UserProfileMenu,
  FormHelper,
  ErrorBoundary,
  UserActionMenu,
  PageContainer,
  PaginationControls,
  TableRow,
  FilterButton,
  AuthFormTitle
} from './molecules';
export { DataTable as MoleculeDataTable } from './molecules';

// Organisms
export {
  RoomDetailHeader,
  RoomDetailTabs,
  RoomInfoCard,
  ResidentsTable,
  Sidebar,
  DrawerEditStudent,
  FormLayout,
  FooterFormAction,
  AccountFormCreate,
  Header,
  AuthForm
} from './organisms';
export { DataTable as OrganismDataTable } from './organisms'; 