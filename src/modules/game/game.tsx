interface Props {
  gameId: string;
}

export default function Game({ gameId }: Props) {
  return <div>Game ID: {gameId}</div>;
}
