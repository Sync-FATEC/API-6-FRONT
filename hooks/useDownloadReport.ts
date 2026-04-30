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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        toast.error(
          "Erro ao processar arquivo",
          "Houve um problema inesperado ao iniciar o download."
        );
      }
    },
    onError: (error) => {
      console.error("Erro ao baixar o relatório ASG:", error);
      toast.error(
        "Erro no download",
        "Não foi possível gerar o relatório para este imóvel no momento."
      );
    },
  });
}
