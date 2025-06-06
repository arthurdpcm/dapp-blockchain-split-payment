const COLORS = {
  purple: '#7C3AED',
  darkGray: '#23272F',
  lightGray: '#F5F5F5',
};

const BRLSwap = () => {
  return (
    <div
      style={{
        background: COLORS.lightGray,
        color: COLORS.darkGray,
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 2px 8px rgba(124,58,237,0.08)',
      }}
    >
      <h2 style={{ color: COLORS.purple }}>BRL Swap</h2>
      <p>Troque seus tokens BRL aqui!</p>
    </div>
  );
};

export default BRLSwap;
