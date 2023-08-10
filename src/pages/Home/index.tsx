/* eslint-disable prettier/prettier */

import { HandPalm, Play } from "phosphor-react";
import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from "./styles";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { useEffect } from "react";
import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";
import { useCycles } from "../../hooks/CyrcleProvider";

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, "informe a tarefa"),
  minutesAmount: zod
    .number()
    .min(5, "O ciclo precisa ser no mínimo de 5 minutos")
    .max(60, "O ciclo precisa ser no máximo de 60 minutos"),
});

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>;

export const Home = () => {
  const {
    activeCycle,
    amountSecondsPassed,
    handleInterruptCycle,
    markCycleAsFineshed,
    createNewCycle,
  } = useCycles();

  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: "",
      minutesAmount: 0,
    },
  });

  const task = watch("task");
  const isSubmitDisabled = !task;

  const onSubmit = (data: NewCycleFormData) => {
    createNewCycle(data, reset);
  };

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;
  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0;

  const minutesAmount = Math.floor(currentSeconds / 60);
  const minutes = String(minutesAmount).padStart(2, "0");

  const secondsAmount = currentSeconds % 60;
  const seconds = String(secondsAmount).padStart(2, "0");

  useEffect(() => {
    markCycleAsFineshed(totalSeconds);
  }, [markCycleAsFineshed, totalSeconds]);

  useEffect(() => {
    if (activeCycle) {
      document.title = `Timer - ${minutes}:${seconds}`;
    }
  }, [minutes, seconds, activeCycle]);

  return (
    <HomeContainer>
      <form action="" onSubmit={handleSubmit(onSubmit)}>
        <NewCycleForm register={register} activeCycle={!!activeCycle} />
        <Countdown minutes={minutes} seconds={seconds} />

        {activeCycle ? (
          <StopCountdownButton type="button" onClick={handleInterruptCycle}>
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton type="submit" disabled={isSubmitDisabled}>
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  );
};
