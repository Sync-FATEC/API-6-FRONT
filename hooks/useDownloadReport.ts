import { useMutation } from "@tanstack/react-query";
import { QueryService } from "@/services/QueryService";
import { toast } from "@/lib/toast";

export function useDownloadReport() {
  return useMutation({
    mutationFn: (car: string) => QueryService.downloadPropertyReport(car),
    onSuccess: (data, car) => {
      try {
        const url = window.URL.createObjectURL(new Blob([data]));

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `relatorio-asg-${car}.pdf`);

        document.body.appendChild(link);
        link.click();

        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast.success("Download concluído", "O relatório ASG foi gerado e baixado com sucesso.");
      } catch {
        toast.error(
          "Erro ao processar arquivo",
          "Um problema com o seu navegador impediu o download do relatório."
        );
      }
    },
    onError: (error) => {
      console.error("Erro ao baixar o relatório ASG:", error);
      toast.error(
        "Erro no download",
        "Ocorreu um problema inesperado ao iniciar a geração do relatório."
      );
    },
  });
}
