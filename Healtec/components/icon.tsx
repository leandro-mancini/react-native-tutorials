import React from "react";
import { SvgProps } from "react-native-svg";
import * as Icons from "../assets/icons";

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
  name: keyof typeof Icons;
}

export const Icon = ({ size = 24, color = "#000", name, ...props }: IconProps) => {
  const SelectedIcon = Icons[name];
  return SelectedIcon ? <SelectedIcon width={size} height={size} color={color} {...props} /> : null;
};