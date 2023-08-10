/* eslint-disable prettier/prettier */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { Cycle } from "../@types/CycleType";
import { differenceInSeconds } from "date-fns";
import * as zod from "zod";
import { UseFormReset } from "react-hook-form";

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, "informe a tarefa"),
  minutesAmount: zod
    .number()
    .min(5, "O ciclo precisa ser no mínimo de 5 minutos")
    .max(60, "O ciclo precisa ser no máximo de 60 minutos"),
});

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>;

interface CycleContextData {
  activeCycle: Cycle | undefined;
  activeCycleId: string | null;
  amountSecondsPassed: number;
  handleInterruptCycle: () => void;
  markCycleAsFineshed: (totalSeconds: number) => () => void;
  createNewCycle: (
    data: NewCycleFormData,
    reset: UseFormReset<{
      task: string;
      minutesAmount: number;
    }>
  ) => void;
}

interface ICycleProviderProps {
  children: React.ReactNode;
}

const CyclesContext = createContext({} as CycleContextData);

export const useCycles = () => {
  const context = useContext(CyclesContext);

  if (!context) {
    throw new Error("useCycles must be within CycleProvider");
  }

  return context;
};

export const CycleProvider: React.FC<ICycleProviderProps> = ({ children }) => {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
  const [amountSecondsPassed, setAmountSecondPassed] = useState(0);

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  const handleInterruptCycle = useCallback(() => {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle === activeCycle) {
          return { ...cycle, interruptDate: new Date() };
        } else {
          return cycle;
        }
      })
    );
    setActiveCycleId(null);
  }, [activeCycle]);

  const markCycleAsFineshed = useCallback(
    (totalSeconds: number) => {
      let interval: number;

      if (activeCycle) {
        interval = setInterval(() => {
          const secondsDifference = differenceInSeconds(
            new Date(),
            activeCycle.startDate
          );

          if (secondsDifference >= totalSeconds) {
            setCycles((state) =>
              state.map((cycle) => {
                if (cycle.id === activeCycleId) {
                  return { ...cycle, fineshedDate: new Date() };
                } else {
                  return cycle;
                }
              })
            );

            setAmountSecondPassed(totalSeconds);
            clearInterval(interval);
          } else {
            setAmountSecondPassed(secondsDifference);
          }
        }, 1000);
      }

      return () => {
        clearInterval(interval);
      };
    },
    [activeCycle, activeCycleId]
  );

  const createNewCycle = useCallback(
    (
      data: NewCycleFormData,
      reset: UseFormReset<{
        task: string;
        minutesAmount: number;
      }>
    ) => {
      const newCycle: Cycle = {
        id: String(new Date().getTime()),
        task: data.task,
        minutesAmount: data.minutesAmount,
        startDate: new Date(),
      };

      setCycles((cycles) => [...cycles, newCycle]);
      setActiveCycleId(newCycle.id);

      setAmountSecondPassed(0);

      reset();
    },
    []
  );

  const providerValue = useMemo(
    () => ({
      activeCycle,
      activeCycleId,
      amountSecondsPassed,
      handleInterruptCycle,
      markCycleAsFineshed,
      createNewCycle,
    }),
    [
      activeCycle,
      activeCycleId,
      amountSecondsPassed,
      handleInterruptCycle,
      markCycleAsFineshed,
      createNewCycle,
    ]
  );

  return (
    <CyclesContext.Provider value={providerValue}>
      {children}
    </CyclesContext.Provider>
  );
};
