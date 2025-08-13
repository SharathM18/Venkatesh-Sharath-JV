import "../css/ConfirmModal.css";

interface ConfirmModalProps {
  onConfirm: () => void;
  isSubmitting: boolean;
}

const ConfirmModal = ({ onConfirm, isSubmitting }: ConfirmModalProps) => {
  return (
    <div className="modal-overlay">
      <div className="confirm-modal">
        <h3>Confirm Submission</h3>
        <button
          className="confirm-btn"
          onClick={onConfirm}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Test"}
        </button>
      </div>
    </div>
  );
};

export default ConfirmModal;
