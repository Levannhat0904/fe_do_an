import React, { FC } from "react";

type Props = {
  children: React.ReactNode;
  title?: string | React.ReactNode;
  rightLayout?: React.ReactNode;
  hidden?: boolean;
  hiddenTitle?: boolean;
};

const KBox: FC<Props> = ({
  hidden,
  children,
  title,
  rightLayout,
  hiddenTitle,
}) => {
  return (
    <div className="flex flex-col gap-4 relative">
      {!hiddenTitle && (
        <div className="flex items-center justify-between">
          <span className="s3-semibold text-black">{title}</span>
          {rightLayout}
        </div>
      )}
      {!hidden && <div className="my-5">{children}</div>}
    </div>
  );
};

export default KBox;
