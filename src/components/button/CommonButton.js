function CommonButton({
  text,
  type = "button",
  style = "primary",
  onClick,
  disabled,
}) {
  const styles = {
    primary:
      "bg-primary text-primary-content hover:bg-primary-light disabled:bg-gray-300 disabled:text-black",
    secondary:
      "bg-secondary text-secondary-content hover:bg-secondary-light disabled:bg-gray-300 disabled:text-black",
    accent:
      "bg-accent text-accent-content hover:bg-accent-light disabled:bg-gray-300 disabled:text-black",
    neutral:
      "bg-neutral text-neutral-content hover:bg-neutral-light disabled:bg-gray-300 disabled:text-black",
    info: "bg-info text-info-content hover:bg-info-light disabled:bg-gray-300 disabled:text-black",
    success:
      "bg-success text-success-content hover:bg-success-light disabled:bg-gray-300 disabled:text-black",
    warning:
      "bg-warning text-warning-content hover:bg-warning-light disabled:bg-gray-300 disabled:text-black",
    error:
      "bg-error text-error-content hover:bg-error-light disabled:bg-gray-300 disabled:text-black",
  };

  return (
    <button
      type={type}
      className={`${styles[style]} w-full mt-2 px-4 py-2 rounded-lg transition-transform duration-200 hover:transform hover:scale-105 focus:transform focus:scale-100`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
}

export default CommonButton;
