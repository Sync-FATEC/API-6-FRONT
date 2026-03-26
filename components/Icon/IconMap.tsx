import {
  IconArrowRight,
  IconHelpHexagonFilled,
  IconMicrophoneFilled,
  IconSend2,
  IconProps as TablerIconProps,
} from "@tabler/icons-react";
import { IconName } from "./IconName";

export const iconMap: Record<IconName, React.FC<TablerIconProps>> = {
  help: IconHelpHexagonFilled,
  mic: IconMicrophoneFilled,
  send: IconSend2,
  "arrow-right": IconArrowRight
};
