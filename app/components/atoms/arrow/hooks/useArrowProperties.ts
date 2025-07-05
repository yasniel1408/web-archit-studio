import { useEffect, useState } from "react";

import { ArrowAnimation, ArrowHeadType, ArrowStyle } from "../types";

interface UseArrowPropertiesProps {
  id: string;
  style: ArrowStyle;
  animation: ArrowAnimation;
  startArrowHead: ArrowHeadType;
  endArrowHead: ArrowHeadType;
  onPropertiesChange?: (properties: {
    style?: ArrowStyle;
    animation?: ArrowAnimation;
    startArrowHead?: ArrowHeadType;
    endArrowHead?: ArrowHeadType;
    color?: string;
    strokeWidth?: number;
  }) => void;
}

export const useArrowProperties = ({
  id,
  style,
  animation,
  startArrowHead,
  endArrowHead,
  onPropertiesChange,
}: UseArrowPropertiesProps) => {
  const [currentStyle, setCurrentStyle] = useState<ArrowStyle>(style);
  const [currentAnimation, setCurrentAnimation] = useState<ArrowAnimation>(animation);
  const [currentArrowHead, setCurrentArrowHead] = useState<ArrowHeadType>(endArrowHead);
  const [currentStartArrowHead, setCurrentStartArrowHead] = useState<ArrowHeadType>(startArrowHead);

  // Sincronizar estado local con las props
  useEffect(() => {
    if (style !== currentStyle) setCurrentStyle(style);
    if (animation !== currentAnimation) setCurrentAnimation(animation);
    if (endArrowHead !== currentArrowHead) setCurrentArrowHead(endArrowHead);
    if (startArrowHead !== currentStartArrowHead) setCurrentStartArrowHead(startArrowHead);
  }, [
    style,
    animation,
    startArrowHead,
    endArrowHead,
    currentStyle,
    currentAnimation,
    currentArrowHead,
    currentStartArrowHead,
  ]);

  // Efecto para actualizar propiedades cuando cambian
  useEffect(() => {
    if (
      onPropertiesChange &&
      (currentStyle !== style ||
        currentAnimation !== animation ||
        currentArrowHead !== endArrowHead ||
        currentStartArrowHead !== startArrowHead)
    ) {
      onPropertiesChange({
        style: currentStyle,
        animation: currentAnimation,
        endArrowHead: currentArrowHead,
        startArrowHead: currentStartArrowHead,
      });
    }
  }, [
    currentStyle,
    currentAnimation,
    currentArrowHead,
    currentStartArrowHead,
    style,
    animation,
    endArrowHead,
    startArrowHead,
    onPropertiesChange,
    id,
  ]);

  // Manejadores para cambios de propiedades
  const handleStyleChange = () => {
    // Rotar entre los estilos de línea
    const styles: ArrowStyle[] = ["solid", "dashed", "dotted"];
    const currentIndex = styles.indexOf(currentStyle);
    const nextIndex = (currentIndex + 1) % styles.length;
    const nextStyle = styles[nextIndex] || "solid";

    setCurrentStyle(nextStyle);

    if (onPropertiesChange) {
      onPropertiesChange({ style: nextStyle });
    }
  };

  const handleAnimationSelect = (anim: ArrowAnimation) => {
    setCurrentAnimation(anim);

    if (onPropertiesChange) {
      onPropertiesChange({ animation: anim });
    }
  };

  const handleArrowHeadChange = () => {
    // Rotar entre los tipos de punta de flecha
    const types: ArrowHeadType[] = ["none", "arrow", "circle", "diamond"];
    const currentIndex = types.indexOf(currentArrowHead);
    const nextIndex = (currentIndex + 1) % types.length;
    const nextType = types[nextIndex] || "arrow";

    setCurrentArrowHead(nextType);

    if (onPropertiesChange) {
      onPropertiesChange({ endArrowHead: nextType });
    }
  };

  const handleStartArrowHeadChange = (type: ArrowHeadType) => {
    setCurrentStartArrowHead(type);

    if (onPropertiesChange) {
      onPropertiesChange({
        startArrowHead: type,
      });
    }
  };

  return {
    currentStyle,
    currentAnimation,
    currentArrowHead,
    currentStartArrowHead,
    handleStyleChange,
    handleAnimationSelect,
    handleArrowHeadChange,
    handleStartArrowHeadChange,
  };
};
