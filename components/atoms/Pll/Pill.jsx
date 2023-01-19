import React from "react";

/**
 *
 * @param {'booked' | 'collected'| 'Incompleted' | 'Completed' | 'completed-blue' | 'completed-yellow' | 'active' | 'inactive'} type
 * @param {*} props
 * @returns
 */
const Pill = (props) => {
  const { children, squared, padding = "py-1 px-5", fit = true } = props;

  let pillType;
  let pillLabel;

  const { type } = props || {};

  switch ((type || "").toLowerCase()) {
    case "checkin":
      pillType = "bg-label-active text-active";
      pillLabel = "Check In";
      break;
    case "booked":
      pillType = "bg-label-booked text-label-booked-text";
      pillLabel = "Booked";
      break;
    case "collected":
      pillType = "bg-label-collected text-label-collected-text";
      pillLabel = "Collected";
      break;
    case "incompleted":
      pillType = "bg-label-incompleted text-label-incompleted-text";
      pillLabel = "Incompleted";
      break;
    case "completed":
      pillType = "bg-label-completed text-label-completed-text";
      pillLabel = "Completed";
      break;
    case "waiting_result":
    case "result_received":
      pillType = "bg-label-waiting-result text-label-waiting-result-text";
      pillLabel =
        props.type == "waiting_result" ? "Waiting Result" : "Result Received";
      break;
    case "active":
      pillType = "bg-label-active text-active";
      pillLabel = "Active";
      break;
    case "inactive":
      pillType = "bg-label-inactive text-inActive";
      pillLabel = "Inactive";
      break;
    case "expired":
      pillType = "bg-label-inactive text-inActive";
      pillLabel = "Expired";
      break;
    case "reswab":
      pillType = "bg-label-waiting-result text-label-waiting-result-text";
      pillLabel = "Need to Reswab";
      break;
    default:
      pillType = "bg-label-active text-active";
      pillLabel = "Active";
      break;
  }
  return (
    <>
      <div
        className={`${
          squared ? "rounded" : "rounded-full"
        } ${pillType} ${padding} ${
          fit && "w-fit"
        } font-semibold text-center mx-auto`}
      >
        {children ? children : pillLabel}
      </div>
    </>
  );
};

export default Pill;
