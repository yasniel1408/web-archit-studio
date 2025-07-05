import React, { ReactNode } from "react";

import { sectionTitleClass } from "../styles";

interface MenuSectionProps {
  title: string;
  children: ReactNode;
}

export const MenuSection: React.FC<MenuSectionProps> = ({ title, children }) => {
  return (
    <div>
      <h4 className={sectionTitleClass}>{title}</h4>
      {children}
    </div>
  );
};
