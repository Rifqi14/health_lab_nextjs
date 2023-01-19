const Alert = props => {
  const { children, borderColor, background } = props;

  return (
    <div
      className={`w-full p-[20px] border ${borderColor} ${background} rounded-[4px]`}
    >
      {children}
    </div>
  );
};

export default Alert;
