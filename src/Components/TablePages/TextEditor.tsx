import * as React from "react";

interface Props {
  value: number | string;
  testId: number;
  field: string;
  handleChange: (value: number, testId: number, field: string) => void;
  type: string;
  discard: boolean;
  setDiscard?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function TextEditor({
  value,
  testId,
  handleChange,
  field,
  discard,
  setDiscard,
}: Props) {
  //   const classes = useStyles(props);

  console.log(value, "value");

  const [name, setName] = React.useState(value || 0);
  const [isNameFocused, setIsNamedFocused] = React.useState(false);

  React.useEffect(() => {
    if (discard) {
      setName(value || 0);
      if (setDiscard) setDiscard(false);
    }
  }, [discard]);

  return (
    <div className="m-0 w-[5rem]">
      {!isNameFocused ? (
        <p
          //   className={classes.name}
          className="p-1"
          onClick={() => {
            setIsNamedFocused(true);
          }}
        >
          {name || 0}
        </p>
      ) : (
        <input
          autoFocus
          //   inputProps={{ className: classes.name }}
          value={name}
          className="border-none outline-none text-sm bg-blue-100 font-medium text-gray-800 whitespace-nowrap m-0 p-1 w-[5rem] my-auto"
          onChange={(event) => setName(parseInt(event.target.value))}
          onBlur={(event) => {
            setIsNamedFocused(false);
            if (name !== 0 && name !== value) {
              handleChange(name as number, testId, field);
            }
          }}
          type={"number"}
          onSubmit={(event) => setIsNamedFocused(false)}
        />
      )}
    </div>
  );
}
