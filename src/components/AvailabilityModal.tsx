import Modal from "./Modal";
import AvailabilityForm from "./AvailabilityForm";
import { useRouter } from "next/router";

interface AvailabilityModalProps {
  token: string;
  date: Date;
  onClose: () => void;
}

const AvailabilityModal: React.FC<AvailabilityModalProps> = ({
  token,
  date,
  onClose,
}) => {
  const router = useRouter();

  return (
    <Modal title="Add Availability" onClose={onClose}>
      <AvailabilityForm
        token={token}
        date={date}
        onSuccess={() => {
          onClose();
          router.reload(); // TODO: refactor availability page to avoid this reload
        }}
      />
    </Modal>
  );
};

export default AvailabilityModal;
