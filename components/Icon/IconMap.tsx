import {
  IconHelpHexagonFilled,
  IconMicrophoneFilled,
  IconSend2,
  IconProps as TablerIconProps,
} from "@tabler/icons-react";
import { IconName } from "./IconName";

export const iconMap: Record<IconName, React.FC<TablerIconProps>> = {
  help: IconHelpHexagonFilled,
  mic: IconMicrophoneFilled,
  send: IconSend2
};
