import { IconProps as TablerIconProps } from "@tabler/icons-react";
import { IconName } from "./IconName";
import { iconMap } from "./IconMap";

interface IconProps extends TablerIconProps {
  name: IconName;
}

export default function Icon({ name, ...props }: IconProps) {
  const SelectedIcon = iconMap[name];

  return <SelectedIcon stroke={props.stroke || 2} {...props} />;
}
