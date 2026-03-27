import {
  IconArrowRight,
  IconGpsFilled,
  IconHelpHexagonFilled,
  IconLeafFilled,
  IconMicrophoneFilled,
  IconSatelliteFilled,
  IconSend2,
  IconProps as TablerIconProps,
} from "@tabler/icons-react";
import { IconName } from "./IconName";
import { IconFist } from "./CustomIcons";

export const iconMap: Record<IconName, React.FC<TablerIconProps>> = {
  help: IconHelpHexagonFilled,
  mic: IconMicrophoneFilled,
  send: IconSend2,
  "arrow-right": IconArrowRight,
  satellite: IconSatelliteFilled,
  gps: IconGpsFilled,
  fist: IconFist,
  leaf: IconLeafFilled,
};
