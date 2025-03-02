interface SaldoProps {
  userBalance: number | null;
}

export function Saldo({ userBalance }: SaldoProps) {
  return (
    <>
      <span
        style={{
          paddingRight: "8px",
          fontFamily: "cursive",
          fontWeight: "bold",
        }}
      >
        Saldo:
      </span>{" "}
      <span style={{ color: "white", fontWeight: "bold" }}>
        {userBalance !== null ? `${userBalance} €` : " "}
      </span>
    </>
  );
}
