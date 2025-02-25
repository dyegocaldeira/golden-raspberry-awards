interface ProducerAwards {
  producer: string;
  interval: number;
  previousWin: number;
  followingWin: number;
}

interface ResultsProducerAwards {
  min: ProducerAwards[];
  max: ProducerAwards[];
}
