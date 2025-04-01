import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { colors } from "@/constants";
interface PaginationControlsProps {
  onPrev: () => void;
  onNext: () => void;
  currentPage: number;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({ onPrev, onNext, currentPage }) => (
  <div className="pagination-controls">
    <button onClick={onPrev}>
      <CaretLeft size={24} color={colors.characterSecondary45} />
    </button>
    <span>{currentPage}</span>
    <button onClick={onNext}>
      <CaretRight size={24} color={colors.characterSecondary45} />,
    </button>
  </div>
);

export default PaginationControls;