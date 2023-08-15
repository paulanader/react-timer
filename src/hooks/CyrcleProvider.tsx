/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useReducer,
  useEffect,
} from "react";
import { Cycle } from "../@types/CycleType";
import { differenceInSeconds } from "date-fns";
import * as zod from "zod";
import { UseFormReset } from "react-hook-form";
import { cyclesReducer } from "../reducers/cycles/reducers";
import {
  addNewCycleAction,
  interruptCurrentCycleAction,
  markCurrentCycleAsFineshedAction,
} from "../reducers/actions";

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, "informe a tarefa"),
  minutesAmount: zod
    .number()
    .min(5, "O ciclo precisa ser no mínimo de 5 minutos")
    .max(60, "O ciclo precisa ser no máximo de 60 minutos"),
});

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>;

interface CycleContextData {
  cycles: Cycle[];
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
  const [cyclesState, dispatch] = useReducer(
    cyclesReducer,

    {
      cycles: [],
      activeCycleId: null,
    }
  );

  const [amountSecondsPassed, setAmountSecondPassed] = useState(0);

  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState);

    localStorage.setItem("@ignite-timer:cycles-state", stateJSON);
  }, [cyclesState]);

  const { cycles, activeCycleId } = cyclesState;

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  const handleInterruptCycle = useCallback(() => {
    dispatch(interruptCurrentCycleAction());
  }, [activeCycleId]);

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
            dispatch(markCurrentCycleAsFineshedAction());

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

      dispatch(addNewCycleAction(newCycle));

      setAmountSecondPassed(0);

      reset();
    },
    []
  );

  const providerValue = useMemo(
    () => ({
      cycles,
      activeCycle,
      activeCycleId,
      amountSecondsPassed,
      handleInterruptCycle,
      markCycleAsFineshed,
      createNewCycle,
    }),
    [
      cycles,
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
