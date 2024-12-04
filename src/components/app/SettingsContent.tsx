import {
  DietaryRestriction,
  DietaryRestrictionLabels,
  FoodIntolerance,
  FoodIntoleranceLabels,
  ISettingsContentProps,
} from "../../../types/AppTypes.ts";

const SettingsContent: React.FC<ISettingsContentProps> = ({
  restrictionsArray,
  intolerancesArray,
  handleRestrictionClick,
  handleIntoleranceClick,
}) => {
  return (
    <div>
      <h3>Select Dietary Restrictions</h3>
      {Object.values(DietaryRestriction).map((restriction) => (
        <div className="space-y-5" key={restriction}>
          <div className="flex gap-3">
            <div className="flex h-6 shrink-0 items-center">
              <div className="group grid size-4 grid-cols-1">
                <input
                  id={restriction}
                  name="restriction"
                  type="checkbox"
                  aria-describedby={restriction}
                  checked={restrictionsArray?.includes(restriction) || false}
                  onChange={() => handleRestrictionClick(restriction)}
                  className="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                />
                <svg
                  fill="none"
                  viewBox="0 0 14 14"
                  className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25"
                >
                  <path
                    d="M3 8L6 11L11 3.5"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-0 group-has-[:checked]:opacity-100"
                  />
                  <path
                    d="M3 7H11"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-0 group-has-[:indeterminate]:opacity-100"
                  />
                </svg>
              </div>
            </div>
            <div className="text-sm/6">
              <label
                htmlFor={restriction}
                className="font-medium text-gray-900"
              >
                {DietaryRestrictionLabels[restriction]}
              </label>{" "}
            </div>
          </div>
        </div>
      ))}
      <h3>Select Food Intolerances</h3>
      {Object.values(FoodIntolerance).map((intolerance) => (
        <div className="space-y-5" key={intolerance}>
          <div className="flex gap-3">
            <div className="flex h-6 shrink-0 items-center">
              <div className="group grid size-4 grid-cols-1">
                <input
                  id={intolerance}
                  name="intolerance"
                  type="checkbox"
                  aria-describedby={intolerance}
                  checked={intolerancesArray?.includes(intolerance) || false}
                  onChange={() => handleIntoleranceClick(intolerance)}
                  className="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                />
                <svg
                  fill="none"
                  viewBox="0 0 14 14"
                  className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25"
                >
                  <path
                    d="M3 8L6 11L11 3.5"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-0 group-has-[:checked]:opacity-100"
                  />
                  <path
                    d="M3 7H11"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-0 group-has-[:indeterminate]:opacity-100"
                  />
                </svg>
              </div>
            </div>
            <div className="text-sm/6">
              <label
                htmlFor={intolerance}
                className="font-medium text-gray-900"
              >
                {FoodIntoleranceLabels[intolerance]}
              </label>{" "}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SettingsContent;
