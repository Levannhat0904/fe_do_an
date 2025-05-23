# Atomic Design Structure - Cấu trúc Component Đã Tối Ưu

## 📁 Cấu trúc thư mục

```
src/components/
├── atoms/           # Các component cơ bản nhất
├── molecules/       # Kết hợp từ atoms
├── organisms/       # Kết hợp từ molecules + atoms
├── templates/       # Layout templates
├── layouts/         # Page layouts
└── pages/          # Business logic pages
```

## ⚛️ Atoms (Các component cơ bản)

### Atomic Design Atoms (Mới)
- `StatusTag` - Hiển thị trạng thái với màu sắc
- `LoadingSpinner` - Component loading
- `FormattedCurrency` - Format tiền tệ
- `FormattedDate` - Format ngày tháng
- `ActionButton` - Button tái sử dụng

### Legacy K* Components (Giữ lại)
- `KButton`, `KInput`, `KText` - UI components cơ bản
- `KLogo`, `KLogoSidebar` - Logo components
- `KSelectField`, `KDatePickerField` - Form fields
- `KTabs`, `KProgress`, `KSwitch` - UI elements

### ❌ Đã xóa (không sử dụng)
- `KSearchBox`
- `KEditableAvatar` 
- `KNavigationButton`
- `KCheckboxAtom`
- `KuffixSelect` (typo folder)

## 🧬 Molecules (Kết hợp từ atoms)

### Atomic Design Molecules (Mới)
- `PageHeader` - Header trang với actions
- `ErrorResult` - Hiển thị lỗi
- `InfoCard` - Card thông tin với descriptions
- `DataTable` - Bảng dữ liệu tái sử dụng
- `RoomEditModal`, `AddResidentModal`, `AddMaintenanceModal`, `AddUtilityModal` - Các modal

### Legacy Molecules (Giữ lại)
- `UserProfileMenu`, `FormHelper`, `ErrorBoundary`
- `UserActionMenu`, `PageContainer`, `PaginationControls`
- `TableRow`, `FilterButton`, `AuthFormTitle`

## 🦠 Organisms (Kết hợp từ molecules + atoms)

### Atomic Design Organisms (Mới)
- `RoomDetailHeader` - Header chi tiết phòng
- `RoomDetailTabs` - Tabs chi tiết phòng
- `RoomInfoCard` - Card thông tin phòng
- `ResidentsTable` - Bảng sinh viên

### Legacy Organisms (Giữ lại)
- `Sidebar`, `Header`, `AuthForm`
- `DataTable`, `DrawerEditStudent`, `FormLayout`
- `FooterFormAction`, `AccountFormCreate`

## 📄 Templates

- `RoomDetailTemplate` - Template trang chi tiết phòng

## 📱 Pages

- Các page components chứa business logic
- Import và sử dụng templates, organisms, molecules, atoms

## 🔧 Utils

### Formatters (`src/utils/formatters.ts`)
- `formatDate()` - Format ngày tháng
- `formatCurrency()` - Format tiền tệ
- `formatDateShort()` - Format ngày ngắn
- `formatDateTime()` - Format ngày giờ đầy đủ

### Page Utils
- `getRoomStatusType()` - Mapping status types

## ✅ Lợi ích đạt được

1. **Tái sử dụng cao**: Atoms và molecules có thể dùng ở nhiều nơi
2. **Dễ bảo trì**: Mỗi component có trách nhiệm rõ ràng
3. **Consistent UI**: Sử dụng chung atoms đảm bảo giao diện nhất quán
4. **Dễ test**: Có thể test từng level riêng biệt
5. **Scalable**: Dễ mở rộng và thêm component mới
6. **Clean imports**: Sử dụng index files để import gọn gàng
7. **Type Safety**: Đã fix các lỗi TypeScript

## 🚀 Cách sử dụng

### Import từ index files
```typescript
// Atoms
import { StatusTag, LoadingSpinner, FormattedCurrency } from '@/components/atoms';

// Molecules  
import { PageHeader, ErrorResult, DataTable } from '@/components/molecules';

// Organisms
import { RoomDetailHeader, RoomInfoCard } from '@/components/organisms';

// Templates
import { RoomDetailTemplate } from '@/components/templates';
```

### Sử dụng trong component
```typescript
const MyComponent = () => {
  return (
    <div>
      <StatusTag status="available" />
      <FormattedCurrency amount={1000000} />
      <DataTable 
        columns={columns}
        dataSource={data}
        showAddButton={true}
        onAdd={handleAdd}
      />
    </div>
  );
};
```

## 📋 TODO

1. Implement MaintenanceTab, UtilitiesTab, TimelineTab organisms
2. Tạo thêm atoms cho các UI elements khác
3. Refactor các page components khác theo cấu trúc atomic design
4. Thêm unit tests cho từng level
5. Tạo Storybook để document components 