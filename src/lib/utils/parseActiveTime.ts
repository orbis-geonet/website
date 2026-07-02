const DAY = [
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sabado",
  "Domingo",
];

export const parseActiveTime = (
  activeTime: { day: string; time: string }[],
) => {
  const temp = activeTime
    .filter((time) => DAY[parseInt(time.day) - 1])
    .map((time) => {
      return { day: DAY[parseInt(time.day) - 1], time: time.time };
    });

  return temp;
};
