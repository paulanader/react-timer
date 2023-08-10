/* eslint-disable prettier/prettier */
import { useCycles } from "../../hooks/CyrcleProvider";
import { HistoryContainer, HistoryList, Status } from "./styles";
import { formatDistanceToNow } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

export const History = () => {
  const { cycles } = useCycles();
  console.log({ cycles });
  return (
    <HistoryContainer>
      <h1>Meu histórico</h1>

      <HistoryList>
        <table>
          <thead>
            <tr>
              <th>Tarefa</th>
              <th>Duração</th>
              <th>Início</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {cycles.map((cycle) => (
              <tr key={cycle.id}>
                <td>{cycle.task}</td>
                <td>{cycle.minutesAmount}</td>
                <td>
                  {formatDistanceToNow(cycle.startDate, {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </td>
                <td>
                  <Status statusColor="yellow">
                    {cycle.interruptedDate
                      ? "Interrompido"
                      : cycle.fineshedDate
                      ? "Concluído"
                      : "Em andamento"}
                  </Status>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </HistoryList>
    </HistoryContainer>
  );
};
