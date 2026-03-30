import {
  IconArrowRight,
  IconShieldFilled,
  IconGpsFilled,
  IconHelpHexagonFilled,
  IconLeafFilled,
  IconMicrophoneFilled,
  IconSatelliteFilled,
  IconSend2,
  IconProps as TablerIconProps,
  IconFlameFilled,
  IconPlayerPause,
} from "@tabler/icons-react";
import { IconName } from "./IconName";
import { IconAxe, IconFist, IconGithub } from "./CustomIcons";

export const iconMap: Record<IconName, React.FC<TablerIconProps>> = {
  help: IconHelpHexagonFilled,
  mic: IconMicrophoneFilled,
  send: IconSend2,
  "arrow-right": IconArrowRight,
  satellite: IconSatelliteFilled,
  gps: IconGpsFilled,
  fist: IconFist,
  leaf: IconLeafFilled,
  shield: IconShieldFilled,
  flame: IconFlameFilled,
  axe: IconAxe,
  github: IconGithub,
  pause: IconPlayerPause,
};
