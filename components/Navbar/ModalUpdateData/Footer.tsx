import Button from "@/components/Button";
import Icon from "@/components/Icon";
import ModalFooter from "@/components/Modal/Footer";

interface Props {
  currentView: "execution" | "history";
  setCurrentView: (view: "execution" | "history") => void;
  isLoading: boolean;
  isStarted: boolean;
  handleExecute: () => Promise<void>;
  onClose: () => void;
  resetState: () => void;
}

export default function ModalUpdateDataFooter({
  currentView,
  setCurrentView,
  isLoading,
  isStarted,
  handleExecute,
  onClose,
  resetState,
}: Props) {
  const goToHistory = () => {
    resetState();
    setCurrentView("history");
  };

  const goToExecution = () => {
    resetState();
    setCurrentView("execution");
  };

  if (currentView === "history") {
    return (
      <ModalFooter
        right={
          <Button variant="primary" size="lg" onClick={goToExecution}>
            Voltar
          </Button>
        }
      />
    );
  }

  return (
    <ModalFooter
      left={
        <Button variant="secondary" size="lg" onClick={goToHistory}>
          <Icon name="clock" size={20} />
          Ver Histórico
        </Button>
      }
      right={
        <>
          <Button
            variant="primary"
            size="lg"
            onClick={handleExecute}
            disabled={isLoading || isStarted}
            className="rounded-r-none"
          >
            <Icon name="play" size={20} />
            Executar Pipeline
          </Button>

          <Button variant="primary" size="lg" square onClick={onClose} className="rounded-l-none -ms-1">
            <Icon name="chevron-down" />
          </Button>
        </>
      }
    />
  );
}
