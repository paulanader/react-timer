/* eslint-disable prettier/prettier */
import { UseFormRegister } from "react-hook-form";
import { FormContainer, MinutesAmountInput, TaskInput } from "./styles";

interface NewCycleFormProps {
  register: UseFormRegister<{
    task: string;
    minutesAmount: number;
  }>;
  activeCycle: boolean;
}

export const NewCycleForm = ({ register, activeCycle }: NewCycleFormProps) => {
  return (
    <FormContainer>
      <label htmlFor="task">Vou trabalhar em</label>
      <TaskInput
        {...register("task")}
        id="task"
        list="task-suggestions"
        disabled={activeCycle}
        placeholder="Dê um nome para o seu projeto"
      />

      <datalist id="task-suggestions">
        <option value="Projeto 1" />
        <option value="Projeto 2" />
        <option value="Projeto 3" />
      </datalist>

      <label htmlFor="minutesAmount">Durante</label>
      <MinutesAmountInput
        {...register("minutesAmount", { valueAsNumber: true })}
        id="minutesAmount"
        disabled={!!activeCycle}
        type="number"
        placeholder="00"
        step={5}
        min={5}
        max={60}
      />
      <span>Minutos</span>
    </FormContainer>
  );
};
